chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (
        tab.url &&
        tab.url.includes("youtube.com/watch")
    ) {
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        // send custom data/messages to ContentScript.js
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"),
        });
    }
});

chrome.commands.onCommand.addListener((shortcut) => {
  if (shortcut === 'reload'){
    console.log('Reloading Extension!')
    chrome.runtime.reload()
  }
})

console.log("testing from background.js")
