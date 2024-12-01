let video = document.querySelector('video');
console.log('video', video);
video.addEventListener('playing', () => {
    let audio = video;
    console.log({
    "action": "audio detected",
    "tag": audio.tagName,
    "tagId": audio.id
    });
    chrome.runtime.sendMessage({
    "action": "audio detected",
    "tag": audio.tagName,
    "tagId": audio.id
    });
});
video.addEventListener('pause', () => {
    let audio = video;
    console.log({
    "action": "audio paused",
    "tag": audio.tagName,
    "tagId": audio.id
    });
    chrome.runtime.sendMessage({
    "action": "audio paused",
    "tagId": audio.id
    });
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log('video',node.querySelector('video'));
        if(node.tagName === 'video') {
            let video = node;
            
            video.addEventListener('playing', (event) => {
              let audio = event.target;
              console.log({
                "action": "audio detected",
                "tag": audio.tagName,
                "tagId": audio.id
              });
              chrome.runtime.sendMessage({
                "action": "audio detected",
                "tag": audio.tagName,
                "tagId": audio.id
              });
            });
    
            video.addEventListener('pause', (event) => {
              let audio = event.target;
              console.log({
                "action": "audio paused",
                "tag": audio.tagName,
                "tagId": audio.id
              });
              chrome.runtime.sendMessage({
                "action": "audio paused",
                "tagId": audio.id
              });
            });
          }
      });
  });
});
  
observer.observe(document.body, { childList: true, subtree: true });



  

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
