chrome.runtime.onInstalled.addListener(function (e) {
    if ("install" == e.reason) {
        chrome.tabs.create({
            url: "https://www.youtube.com"
        })
    }
    chrome.storage.sync.set({
        AdblockerForHotstar: true,
        installedOn: Date.now()
    })
})
