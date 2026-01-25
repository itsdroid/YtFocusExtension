YT Focus Mode 🚀
YT Focus Mode is a lightweight Chrome Extension designed to help students, developers, and lifelong learners stay focused on YouTube. It removes the algorithmic "traps"—like the homepage feed, sidebar recommendations, and comments—allowing you to watch tutorials without getting distracted.

✨ Features
Master Toggle: Turn all focus features on or off with a single click.

Individual Controls:

Disable Homepage: Hides the infinite scroll feed on the YouTube home screen.

Disable Comments: Removes the comments section to avoid "scroll-hole" discussions.

Disable Side Videos: Hides the recommendation sidebar while watching a video.

Disable Shorts: Removes Shorts shelves and navigation links.

Custom Branding: Replaces the standard YouTube logo with a clean "Focus" logo.

Persistence: Remembers your settings even after you close the browser.

🛠️ Installation (Development Mode)
Clone the repository:

Bash

git clone https://github.com/your-username/yt-focus-mode.git
Open Chrome and navigate to chrome://extensions/.

Enable Developer Mode (toggle in the top right corner).

Click Load unpacked and select the project folder.

📁 Project Structure
Plaintext

├── icons/            # Extension icons (16x16, 48x48, 128x128)
├── content.js        # Logic to inject CSS and observe page changes
├── focus.png         # Logo used for YouTube header replacement
├── manifest.json     # Extension configuration and permissions
├── popup.html        # The UI for the extension menu
├── popup.js          # Logic for toggles and storage syncing
└── style.css         # Styling for the extension popup
🚀 How it Works
The extension uses a MutationObserver in content.js to watch for YouTube's dynamic page navigation. It injects specific CSS rules based on your preferences stored in chrome.storage.local.

Since YouTube is a Single Page Application (SPA), the observer ensures that even when you click on a new video, the distractions stay hidden without needing a page refresh.

📝 Permissions Used
storage: To save your toggle preferences.

activeTab: To communicate between the popup and the current YouTube tab.
