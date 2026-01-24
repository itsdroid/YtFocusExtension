const checkbox = document.getElementById("myCheckbox");
const statusText = document.getElementById("statusText");

const hideCSS = {
    css: "#secondary, #comments { display: none !important; }",
    target: { tabId: null }
};

chrome.storage.local.get("enabled", (data) => {
    checkbox.checked = !!data.enabled;
    updateStatusUI(data.enabled);
});

checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    
    chrome.storage.local.set({ "enabled": isChecked });

    statusText.innerText = isChecked ? "Active" : "Deactivate";
    statusText.style.color = isChecked ? "green" : "red";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "toggleUI", enabled: isChecked });
        }
    });
});

function updateStatusUI(enabled) {
    statusText.innerText = enabled ? "Active" : "Deactivate";
    statusText.style.color = enabled ? "green" : "red";
}