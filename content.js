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