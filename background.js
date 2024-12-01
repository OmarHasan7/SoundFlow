let previous = null;
let current = null;


chrome.runtime.onMessage.addListener(
    (message, sender) => {
        console.log(sender.url);
        if(previous === null) {
            previous = {
                "tabId": sender.tab.id,
                "tag": message.tag,
                "id": message.tagId,
            };
            console.table([previous, current]);
        }
        else if(previous) {
            if(message.action === "audio detected") {
                    if(current && sender.tab.id !== current.tabId) {
                            chrome.tabs.sendMessage( current.tabId, {
                            "action": "pause",
                            "tag": current.tag,
                            "id": current.id,
                        });
                        previous = current;
                        current = {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId,};
                        console.table([previous, current]);
                    }
                    else if(current === null && previous.tabId !== sender.tab.id) {
                            chrome.tabs.sendMessage( previous.tabId, {
                            "action": "pause",
                            "tag": previous.tag,
                            "id": previous.id
                            });
                        current = {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId,};    
                        console.table([previous, current]);
                    }
            }
            else if(message.action === "audio paused" && current && sender.tab.id === current.tabId) {
                // if(sender.tab.id !== current.tabId) {
                //     current = {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId};
                // }
                playPausedVid();
            }
        }
    }
);

async function playPausedVid()
{
    let playOnpause = await getDataFromStorage("playOnpause");
    console.log(playOnpause);

    if(playOnpause) {
        chrome.tabs.sendMessage( previous.tabId, {
            "action": "play",
            "tag": previous.tag,
            "id": previous.id,
        });
        let tmp = current;
        current = previous;
        previous = tmp;
        console.table([previous, current]);
    }
}
function getDataFromStorage(key) 
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






                // if (message.action === "audio detected" && previous && previous.tabId !== sender.tab.id) {
        //     chrome.tabs.sendMessage( previous.tabId, {
        //         "action": "pause",
        //         "tag": previous.tag,
        //         "id": previous.id
        //     });
        //     current = {
        //         "tabId": sender.tab.id,
        //         "tag": message.tag,
        //         "id": message.tagId,
        //     }
        // }
        // // else if(message.action === "audio paused" && previous && sender.tab.id !== current.tabId) {
        // //     chrome.tabs.sendMessage( previous.tabId, {
        // //         "action": "play",
        // //         "tag": previous.tag,
        // //         "id": previous.id
        // //     });
        // // }
        // if(previous === null) {
        //     previous = {
        //         "tabId": sender.tab.id,
        //         "tag": message.tag,
        //         "id": message.tagId,
        //     };
        // }
        // else {
        //     current = {
        //         "tabId": sender.tab.id,
        //         "tag": message.tag,
        //         "id": message.tagId,
        //     };
        // }
