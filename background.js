let previous = null;
chrome.runtime.onMessage.addListener(
    (message, sender) => {
        if (previous && previous.tabId !== sender.tab.id && message.action === "audio detected") {
            chrome.tabs.sendMessage( previous.tabId, {
                "action": "pause",
                "tag": previous.tag,
                "id": previous.id
            });
        }
        previous = {
            "tabId": sender.tab.id,
            "tag": message.tag,
            "id": message.tagId,
        };
        console.log(previous);
    }
);