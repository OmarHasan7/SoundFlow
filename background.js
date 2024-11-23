let previous = null;
let current = null;

chrome.runtime.onMessage.addListener(
    (message, sender) => {
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
                            "id": current.id
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
            else if(message.action === "audio paused" && current) {
                // if(sender.tab.id !== current.tabId) {
                //     current = {"tabId": sender.tab.id, "tag": message.tag, "id": message.tagId};
                // }
                if(sender.tab.id === current.tabId) {
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
        }
    }
);









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
