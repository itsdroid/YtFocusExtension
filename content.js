function applyFocusMode() {
    chrome.storage.local.get([
        'myCheckboxhomepage',
        'myCheckboxcomments',
        'myCheckboxsidebar',
        'myCheckboxshorts'
    ], (data) => {
        
        let oldStyle = document.getElementById('focus-mode-style');
        if (oldStyle) oldStyle.remove();

        let css = '';

        if (data.myCheckboxhomepage) {
            css += 'ytd-browse[page-subtype="home"] { display: none !important; }';
        }
        if (data.myCheckboxcomments) {
            css += '#comments { display: none !important; }';
        }
        if (data.myCheckboxsidebar) {
            css += '#secondary { display: none !important; }';
        }
        if (data.myCheckboxshorts) {
            css += 'ytd-reel-shelf-renderer, [title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"] { display: none !important; }';
        }

        const style = document.createElement('style');
        style.id = 'focus-mode-style';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    });
}

applyFocusMode();

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "update") {
        applyFocusMode();
    }
});



// ad block logic


setInterval(() => {
    let currentPageUrl = window.location.href;
    let adVideoContainer = document.querySelector("#ad-video-container");
    let skipButton = document.querySelector(".ytp-ad-skip-button");
    let itemSections = document.querySelectorAll(".style-scope ytd-item-section-renderer");
    let adShowingPlayer = document.querySelector(".html5-video-player.ad-showing");

    document.querySelector("ytd-rich-item-renderer ytd-display-ad-renderer") &&
        (document.querySelector("ytd-rich-item-renderer ytd-display-ad-renderer")
            .parentElement.parentElement.style.display = "none");

    document.querySelector("ytd-player-legacy-desktop-watch-ads-renderer") &&
        (document.querySelector("ytd-player-legacy-desktop-watch-ads-renderer").style.display = "none");

    document.querySelector("#player-ads") &&
        (document.querySelector("#player-ads").style.display = "none");

    document.querySelector(".ytp-ad-image-overlay") &&
        (document.querySelector(".ytp-ad-image-overlay").getAttribute("display") != "none")
            ? document.querySelector(".ytp-ad-image-overlay").style.display = "none"
            : "";

    document.querySelector(".ytp-ad-text-overlay") &&
        (document.querySelector(".ytp-ad-text-overlay").getAttribute("display") != "none")
            ? document.querySelector(".ytp-ad-text-overlay").style.display = "none"
            : "";

    document.querySelector("#player-ads") &&
        ((document.querySelector("#player-ads").getAttribute("display") != "none")
            ? document.querySelector("#player-ads").style.display = "none"
            : "");

    if (itemSections) {
        if (itemSections.length > 0) {
            for (let index = 0; index < itemSections.length; index++) {
                if (itemSections[index].querySelector("#sitelinks-table")) {
                    itemSections[index].getAttribute("display") != "none" &&
                        (itemSections[index].style.display = "none");
                }
            }
        }
    }

    if (adShowingPlayer) {
        if (skipButton) {
            skipButton.click();
        } else {
            let videoElement = adShowingPlayer.querySelector("video");
            if (videoElement) {
                videoElement.currentTime = isNaN(videoElement.duration)
                    ? 0
                    : videoElement.duration;
            }
        }
    }

    if (currentPageUrl.includes("hotstar.com")) {
        if (adVideoContainer && adVideoContainer.checkVisibility()) {
            let hotstarVideo = adVideoContainer.querySelector("video");
            if (hotstarVideo) {
                hotstarVideo.currentTime = isNaN(hotstarVideo.duration)
                    ? 0
                    : hotstarVideo.duration;
            }
        }
    }
}, 250);




// Function to find and click the skip button
const skipAd = () => {
    // YouTube uses several classes for skip buttons; these are the most common
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern');
    
    if (skipButton) {
        skipButton.click();
        console.log("Gemini: Ad skipped!");
    }
};

// Create an observer to watch for changes in the video player
const observer = new MutationObserver(() => {
    skipAd();
});

// Start observing the body of the page for added elements
observer.observe(document.body, {
    childList: true,
    subtree: true
});
