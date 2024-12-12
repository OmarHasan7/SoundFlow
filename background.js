let previous = null;
let current = null;

const messageQueue = [];


async function QueueHandler()
{
    while(messageQueue.length > 0) {
        previous = await getDataFromStorageLocal('previous')?? null;
        current = await getDataFromStorageLocal('current')?? null;
        let playOnpause = await getDataFromStorageSync("playOnpause"); 
        if(previous === null) {
            chrome.storage.local.set({
                'previous': {
                    "tabId": messageQueue[0].sender.tab.id,
                    "tag": messageQueue[0].message.tag,
                    "id": messageQueue[0].message.tagId,                        
                }
            });
        }
        else if(previous) {
            if(messageQueue[0].message.action === "audio detected") {
                    if(current && messageQueue[0].sender.tab.id !== current.tabId) {
                            chrome.tabs.sendMessage( current.tabId, {
                            "action": "pause",
                            "tag": current.tag,
                            "id": current.id,
                        });
                        chrome.storage.local.set({
                            "previous": current,
                            "current": {"tabId": messageQueue[0].sender.tab.id, "tag": messageQueue[0].message.tag, "id": messageQueue[0].message.tagId,}
                        });
                    }
                    else if(current === null && previous.tabId !== messageQueue[0].sender.tab.id) {
                        chrome.tabs.sendMessage( previous.tabId, {
                            "action": "pause",
                            "tag": previous.tag,
                            "id": previous.id
                        });
                        chrome.storage.local.set({"current": {"tabId": messageQueue[0].sender.tab.id, "tag": messageQueue[0].message.tag, "id": messageQueue[0].message.tagId,}});
                    }
            }
            else if(messageQueue[0].message.action === "audio paused" && current && messageQueue[0].sender.tab.id === current.tabId) {
                playPausedVid(playOnpause);
            }
        }
        messageQueue.shift();
    }
}






chrome.runtime.onMessage.addListener(
    async (message, sender) => {
        // append to queue
        messageQueue.push({"message": message, "sender": sender});
        QueueHandler();
    }
);

chrome.tabs.onRemoved.addListener(async (tabId) => {
    previous = await getDataFromStorageLocal('previous')?? null;
    current = await getDataFromStorageLocal('current')?? null;
    let playOnpause = await getDataFromStorageSync("playOnpause"); 
    if(tabId === current.tabId) {
        playPausedVid(playOnpause);
    }
});





async function playPausedVid(playOnpause)
{

    if(playOnpause) {
        chrome.tabs.sendMessage( previous.tabId, {
            "action": "play",
            "tag": previous.tag,
            "id": previous.id,
        });
        let tmp = current;
        chrome.storage.local.set({
            "current": previous,
            "previous": tmp
        });
    }
}
function getDataFromStorageSync(key) 
{
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, function(result) {
            if (chrome.runtime.lastError) {
                 reject(false); 
            }
            else {
                 resolve(result[key]);
            }
        });
    });
}
function getDataFromStorageLocal(key)
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, function(result) {
            if (chrome.runtime.lastError) {
                 reject(false); 
            }
            else {
                 resolve(result[key]);
            }
        });
    });
}

