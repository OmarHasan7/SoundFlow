const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log('video',node.querySelector('video'));
        if(node.querySelector('video')) {
            let video = node.querySelector('video');
            const uniqueId = Math.random().toString(36).slice(2, 8);
            video.id = uniqueId;
    
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



// document.querySelectorAll('video', 'audio').forEach(elm => {
//   elm.addEventListener('playing', () => {
//     let audio = elm;
//     console.log({
//       "action": "audio detected",
//       "tag": audio.tagName,
//       "tagId": audio.id
//     });
//     chrome.runtime.sendMessage({
//       "action": "audio detected",
//       "tag": audio.tagName,
//       "tagId": audio.id
//     });
//   });
// });

// document.querySelectorAll('video', 'audio').forEach(elm => {
//   elm.addEventListener('pause', () => {
//     let audio = elm;
//     console.log({
//       "action": "audio paused",
//       "tag": audio.tagName,
//       "tagId": audio.id
//     });
//     chrome.runtime.sendMessage({
//       "action": "audio paused",
//       "tagId": audio.id
//     });
//   });
// });

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
