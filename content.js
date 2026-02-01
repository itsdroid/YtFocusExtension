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
(() => {
    "use strict";

    const AD_UI_SELECTORS = [
        ".video-ads", ".ytp-ad-module", ".ytp-ad-overlay-container",
        "#masthead-ad", "ytd-ad-slot-renderer"
    ];

    function instantSkip() {
        const video = document.querySelector('video');
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');

        // AGGRESSIVE: If an ad is active, skip to the end immediately
        if (adShowing && video) {
            // 1. Mute to prevent audio "pops"
            video.muted = true;
            // 2. Set playback speed to max (optional, adds extra insurance)
            video.playbackRate = 16.0; 
            // 3. Jump to the end
            if (isFinite(video.duration)) {
                video.currentTime = video.duration;
            }
            console.log("[Skipper] Ad detected: Fast-forwarding to end.");
        }

        // STANDARD: Click any skip buttons that do pop up
        const skipBtn = document.querySelector(".ytp-ad-skip-button, .ytp-ad-skip-button-modern");
        if (skipBtn) skipBtn.click();

        // COSMETIC: Hide the ad overlays so they don't flicker
        AD_UI_SELECTORS.forEach(s => {
            const el = document.querySelector(s);
            if (el) el.style.display = "none";
        });
    }

    // React instantly to page changes
    const observer = new MutationObserver(instantSkip);
    observer.observe(document.documentElement, { childList: true, subtree: true });

    instantSkip();
})();