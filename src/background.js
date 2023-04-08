chrome.contextMenus.create({
  id: "selectedText",
  title: "中文 '%s'",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "selectedText") {
    const response = await sendMessagePromise(tab.id, {
      type: "translate-button-clicked",
      text: info.selectionText,
    });
    console.log("Received translatedText:", response.translatedText);
    const translatedText = response.translatedText;

    if (translatedText !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (translatedText) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(translatedText));
          console.log("Injected translatedText", translatedText);
          selection.removeAllRanges();
          selection.addRange(range);
        },
        args: [translatedText],
      });
    }
  }
});

function sendMessagePromise(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, resolve);
  });
}
