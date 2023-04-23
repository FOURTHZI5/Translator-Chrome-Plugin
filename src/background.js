const { createPopper } = require('@popperjs/core');

chrome.contextMenus.create({
  id: "selectedText",
  title: "中文 \"%s\"",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "selectedText") {
    try {
      const message = {
        type: "translate-button-clicked",
        text: info.selectionText,
      };
      await sendMessagePromise(tab.id, message);
    } catch (error) {
      console.log("Failed to send message:", error);
    }
  }
});

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