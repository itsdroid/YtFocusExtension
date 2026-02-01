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

    // Only targeting video player ads to avoid messing up the Homepage UI
    const PLAYER_AD_SELECTORS = [
        ".video-ads", ".ytp-ad-module", ".ytp-ad-overlay-container", ".ytp-ad-player-overlay"
    ];

    function instantSkip() {
        const video = document.querySelector('video');
        // Check for ad-active classes on the player container
        const adShowing = document.querySelector('.ad-showing, .ad-interrupting');
        const skipBtn = document.querySelector(".ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button");

        if (adShowing && video) {
            // 1. Mute and speed up
            if (!video.muted) video.muted = true;
            video.playbackRate = 16.0;

            // 2. The "Smooth Jump"
            // We check if duration is valid and jump slightly before the end 
            // to allow the player's own logic to transition to the next video.
            if (isFinite(video.duration) && video.currentTime < video.duration - 0.5) {
                video.currentTime = video.duration - 0.1;
            }
            
            // 3. Auto-click if button exists
            if (skipBtn) {
                skipBtn.click();
            }

            // 4. Recovery: prevent the "infinite buffer" or "stuck blank"
            if (video.paused) {
                video.play().catch(() => {});
            }
        } 
        
        // 5. Restoration: Only reset if the ad classes are GONE
        else if (video && video.playbackRate > 2 && !adShowing) {
            video.playbackRate = 1.0;
            video.muted = false;
        }

        // 6. Cosmetic: Only hide player-specific overlays
        PLAYER_AD_SELECTORS.forEach(s => {
            const elements = document.querySelectorAll(s);
            elements.forEach(el => {
                if (el && el.style.display !== "none") {
                    el.style.display = "none";
                }
            });
        });
    }

    // Faster interval for smoother catching of ad starts
    const skipInterval = setInterval(instantSkip, 100);

    // Observer to handle dynamic player loads
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length || mutation.type === 'attributes') {
                instantSkip();
            }
        }
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['class'] // Specifically watch for class changes like 'ad-showing'
    });
})();


