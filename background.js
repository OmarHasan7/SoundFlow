let previous = null;
let current = null;


chrome.runtime.onMessage.addListener(
    async (message, sender) => {
        previous = await getDataFromStorageLocal('previous')?? null;
        current = await getDataFromStorageLocal('current')?? null;    
        console.log(sender.url);
        console.table([previous, current]);
        if(previous === null) {
            chrome.storage.local.set({
                'previous': {
                    "tabId": sender.tab.id,
                    "tag": message.tag,
                    "id": message.tagId,                        
                }
            });
        }
        else if(previous) {
            if(message.action === "audio detected") {
                    if(current && sender.tab.id !== current.tabId) {
                            chrome.tabs.sendMessage( current.tabId, {
                            "action": "pause",
                            "tag": current.tag,
                            "id": current.id,
                        });
                        chrome.storage.local.set({
                            "previous": current,
                            "current": {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId,}
                        }, () => {
                            chrome.storage.local.get(['previous', 'current'], (result) => {
                                console.table(result);
                            });
                        });
                    }
                    else if(current === null && previous.tabId !== sender.tab.id) {
                        chrome.tabs.sendMessage( previous.tabId, {
                            "action": "pause",
                            "tag": previous.tag,
                            "id": previous.id
                        });
                        chrome.storage.local.set({"current": {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId,}},
                            () => {
                                chrome.storage.local.get(['current'], (result) => {
                                    console.table('Saved data:', result);
                                });
                            }
                        );
                    }
            }
            else if(message.action === "audio paused" && current && sender.tab.id === current.tabId) {
                playPausedVid();
            }
        }
    }
);

chrome.tabs.onRemoved.addListener(async (tabId) => {
    previous = await getDataFromStorageLocal('previous')?? null;
    current = await getDataFromStorageLocal('current')?? null;
    if(tabId === current.tabId) {
        playPausedVid();
    }
});





async function playPausedVid()
{
    let playOnpause = await getDataFromStorageSync("playOnpause");
    console.log(playOnpause);

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
        }, (data) => {
            console.table(data);
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

