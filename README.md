# YT Focus Mode 🚀

**YouTube Focus Mode** is a lightweight Chrome Extension designed to help students, developers, and learners stay focused. It surgically removes the algorithmic "traps"—like the homepage feed, sidebar recommendations, and comments—allowing you to watch tutorials without getting pulled into a scroll-hole.

## 📸 Preview

| Homepage Clean | Watch Page Focus | Control Menu |
| :---: | :---: | :---: |
| <img src="screenshot1.png" width="400"> | <img src="screenshot2.png" width="400"> | <img src="screenshot3.png" width="200"> |

---

## ✨ Features

* **Master Toggle:** Turn all focus features on or off with a single switch.
* **Customizable Distraction Removal:**
    * **Disable Homepage:** Hides the infinite scroll feed on the YouTube home screen.
    * **Disable Comments:** Removes the comments section to avoid distraction.
    * **Disable Side Videos:** Hides the recommendation sidebar while watching.
    * **Disable Shorts:** Removes Shorts shelves and navigation links across the site.
* **Minimalist Branding:** Replaces the standard YouTube logo with a custom "Focus" logo.
* **Smart Persistence:** Automatically remembers your preferences using `chrome.storage`.

---

## 🛠️ Installation (Development Mode)

If you want to run this extension locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/yt-focus-mode.git](https://github.com/your-username/yt-focus-mode.git)
Open Google Chrome and go to chrome://extensions/.

Enable Developer Mode (toggle in the top right corner).

Click Load unpacked and select the folder containing these files.

📁 Project Structure
Plaintext

├── icons/            # App icons (16, 48, 128)
├── content.js        # Logic that hides elements on YouTube
├── focus.png         # Logo for YouTube header replacement
├── manifest.json     # Metadata and permissions
├── popup.html        # UI for the extension menu
├── popup.js          # Logic for toggles and storage sync
└── style.css         # Styling for the popup UI
⚙️ How It Works
This extension utilizes a MutationObserver in content.js. Because YouTube is a Single Page Application (SPA), content changes dynamically without a full page refresh. The observer detects these changes and re-applies your focus settings instantly.

📝 Permissions Used
storage: To save your toggle settings across sessions.

activeTab: To communicate settings changes to the current YouTube tab.
