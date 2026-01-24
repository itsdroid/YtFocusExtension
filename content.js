function applyFocusMode(shouldEnabled) {
    let styleTag = document.getElementById("youtube-focus-style");


    if (shouldEnabled) {
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "youtube-focus-style";
            styleTag.innerHTML = `
                /* Hide Homepage Feed */
                ytd-browse[page-subtype="home"] #primary,
                ytd-rich-grid-renderer { 
                    display: none !important; 
                }

                /* Hide Watch Page Sidebar & Comments */
                #secondary, #comments { 
                    display: none !important; 
                }
            `;
            document.head.appendChild(styleTag);
        }
    } else {
        if (styleTag) styleTag.remove();
    }
}

chrome.storage.local.get("enabled", (data) => {
    applyFocusMode(data.enabled);
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleUI") {
        applyFocusMode(request.enabled);
    }
});




