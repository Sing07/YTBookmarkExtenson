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

// chrome.webNavigation.onHistoryStateUpdated.addListener(
//     (details) => {
//         if (details.url.includes("youtube.com/watch")) {
//             const urlParams = new URLSearchParams(details.url.split("?")[1]);
//             console.log(
//                 "Sending NEW message to content script for video ID:",
//                 urlParameters.get("v")
//             );

//             chrome.tabs.sendMessage(details.tabId, {
//                 type: "NEW",
//                 videoId: urlParams.get("v"),
//             });
//         }
//     },
//     {
//         url: [{ hostContains: "youtube.com" }],
//     }
// );
