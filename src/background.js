var menuItemCreated = false;

function updateContextMenu() {
  chrome.storage.sync.get(["switch"], function (items) {
    var enabled = items.switch;
    if (enabled && !menuItemCreated) {
      try {
        chrome.contextMenus.create({
          id: "selectedText",
          title: '中文 "%s"',
          contexts: ["selection"],
        }); // Attach the translateOnClickHandler variable to the chrome.contextMenus.onClicked event
        chrome.contextMenus.onClicked.addListener(translateOnClickHandler);
        menuItemCreated = true;
      } catch (error) {
        console.error(error);
      }
    } else if (!enabled && menuItemCreated) {
      chrome.contextMenus.remove("selectedText", function () {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          // Remove the translateOnClickHandler variable from the chrome.contextMenus.onClicked event
          chrome.contextMenus.onClicked.removeListener(translateOnClickHandler);
          menuItemCreated = false;
        }
      });
    }
  });
}

// Call updateContextMenu when the extension is first loaded
updateContextMenu();

// Listen for changes to the "switch" key in chrome.storage.sync
chrome.storage.onChanged.addListener(function(changes, areaName) {
  if (areaName === "sync" && changes.hasOwnProperty("switch")) {
    updateContextMenu();
  }
});

async function translateOnClickHandler(info, tab) {
  if (info.menuItemId === "selectedText") {
    try {
      const { apiKey } = await chrome.storage.sync.get("apiKey");
      const message = { type: "translate-button-clicked", text: info.selectionText, apiKey };
      await sendMessagePromise(tab.id, message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
}

function sendMessagePromise(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
