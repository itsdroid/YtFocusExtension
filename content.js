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
        "#masthead-ad", "ytd-ad-slot-renderer", ".ytp-ad-player-overlay"
    ];

    function instantSkip() {
        const video = document.querySelector('video');
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
        const skipBtn = document.querySelector(".ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button");

        if (adShowing && video) {
            // 1. Mute and max speed
            video.muted = true;
            video.playbackRate = 16.0;

            // 2. Aggressive Jump
            // Instead of just video.duration, we use a large number to ensure it hits the limit
            if (Number.isFinite(video.duration)) {
                video.currentTime = video.duration - 0.1; // Jump to almost the end
            }
            
            // 3. Force click the button if it's there
            if (skipBtn) {
                skipBtn.click();
            }

            // 4. NEW: If the video is paused at the end of an ad, force play
            if (video.paused) {
                video.play().catch(() => {}); 
            }
        } else if (video && video.playbackRate > 2) {
            // RESTORE: If no ad is showing but playback is still 16x, reset it
            video.playbackRate = 1.0;
            video.muted = false;
        }

        // COSMETIC: Hide UI elements
        AD_UI_SELECTORS.forEach(s => {
            const elements = document.querySelectorAll(s);
            elements.forEach(el => {
                if (el.style.display !== "none") el.style.display = "none";
            });
        });
    }

    // Optimization: Use a faster check interval alongside the observer 
    // to catch the "black screen" state transitions faster.
    setInterval(instantSkip, 100);

    const observer = new MutationObserver(instantSkip);
    observer.observe(document.body, { childList: true, subtree: true });
})();






