const statusText = document.getElementById("statusText");
const checkboxIds = [
    'myCheckbox',
    'myCheckboxhomepage',
    'myCheckboxcomments',
    'myCheckboxsidebar',
    'myCheckboxshorts'
];

function updateStatus() {
    const isAnyChecked = checkboxIds.some(id => document.getElementById(id).checked);
    statusText.innerText = isAnyChecked ? "Active" : "Inactive";
    statusText.style.color = isAnyChecked ? "green" : "red";
}

chrome.storage.local.get(checkboxIds, (result) => {
    checkboxIds.forEach(id => {
        if (result[id] !== undefined) {
            document.getElementById(id).checked = result[id];
        }
    });
    updateStatus();
});

checkboxIds.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        chrome.storage.local.set({ [id]: isChecked });

        if (id === 'myCheckbox') {
            checkboxIds.forEach(otherId => {
                if (otherId !== 'myCheckbox') {
                    document.getElementById(otherId).checked = isChecked;
                    chrome.storage.local.set({ [otherId]: isChecked });
                }
            });
        }

        updateStatus();

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "update" });
            }
        });
    });
});