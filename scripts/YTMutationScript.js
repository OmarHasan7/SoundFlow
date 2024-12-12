Listeners();

document.addEventListener('yt-navigate-finish', () => {
  AttachMutationObserver();
});

function Listeners()
{
    if(document.querySelector('video')) {
        document.querySelectorAll('video').forEach((vid) => {
            if(vid.src !== '') {
                vid.addEventListener('playing', (event) => {
                    let audio = event.target;
                    chrome.runtime.sendMessage({
                        "action": "audio detected",
                        "tag": audio.tagName,
                        "tagId": audio.id ?? null
                    });
                });
            }
        });
        
        document.querySelectorAll('video').forEach((vid) => {
            if(vid.src !== '') {
                vid.addEventListener('pause', (event) => {
                    let audio = event.target;
                    chrome.runtime.sendMessage({
                        "action": "audio paused",
                        "tag": audio.tagName,
                        "tagId": audio.id ?? null
                    });
                });
            }
        });
    }
}


function AttachMutationObserver()
{
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        let parent = node.parentNode;
        if(node.ariaLabel === 'YouTube Video Player' && parent.parentNode.id !== 'inline-player') {
            let video = node.querySelector('video');
            const uniqueId = Math.random().toString(36).slice(2, 8);
            video.id = uniqueId;
    
            video.addEventListener('playing', (event) => {
              let audio = event.target;
              chrome.runtime.sendMessage({
                "action": "audio detected",
                "tag": audio.tagName,
                "tagId": audio.id
              });
            });
    
            video.addEventListener('pause', (event) => {
              let audio = event.target;
              chrome.runtime.sendMessage({
                "action": "audio paused",
                "tagId": audio.id
              });
            });
          }
      });
    });
  });

  observer.observe(document.querySelector('ytd-app'), { childList: true, subtree: true });
}


chrome.runtime.onMessage.addListener( (message) => {
    if(message.action === "pause") {
        if(!message.id) {
            document.querySelector(message.tag).pause();
        }
        else {
            let audio = document.getElementById(message.id);
            audio.pause();
        }
    }
    else if (message.action === 'play') {
        if(!message.id) {
            document.querySelector(message.tag).play();
        }
        else {
            let audio = document.getElementById(message.id);
            audio.play();
        }
    }
});
