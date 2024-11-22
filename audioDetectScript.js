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

chrome.runtime.onMessage.addListener( (message) => {
    if(message.action === "pause") {
        if(!message.id) {
            document.querySelector(message.tag).pause();
        }
        else {
            document.querySelector(message.id).pause();            
        }
    }
})
