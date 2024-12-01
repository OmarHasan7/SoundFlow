document.querySelector('video').addEventListener('playing', (event) => {
    let audio = event.target;
    console.log({
        "action": "audio detected",
        "tag": audio.tagName,
        "tagId": audio.id ?? null
    });
    chrome.runtime.sendMessage({
        "action": "audio detected",
        "tag": audio.tagName,
        "tagId": audio.id ?? null
    });
});

document.querySelector('video').addEventListener('pause', (event) => {
    let audio = event.target;
    console.log({
        "action": "audio paused",
        "tag": audio.tagName,
        "tagId": audio.id ?? null
    });
    chrome.runtime.sendMessage({
        "action": "audio paused",
        "tag": audio.tagName,
        "tagId": audio.id ?? null
    });
});

chrome.runtime.onMessage.addListener( (message) => {
    if(message.action === "pause") {
        if(!message.id) {
            document.querySelector(message.tag).pause();
        }
        else {
            document.querySelector(message.id).pause();            
        }
    }
    else if (message.action === 'play') {
        if(!message.id) {
            document.querySelector(message.tag).play();
        }
        else {
            document.querySelector(message.id).play();            
        }
    }
});
