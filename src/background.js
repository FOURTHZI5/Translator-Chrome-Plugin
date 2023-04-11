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
    let translatedText = response.translatedText;

    // Remove leading and trailing newlines
    if (translatedText.startsWith("\n")) {
      translatedText = translatedText.slice(1);
    }
    if (translatedText.endsWith("\n")) {
      translatedText = translatedText.slice(0, -1);
    }

    if (translatedText !== undefined) {
      injectTranslatedText(tab.id, translatedText);
    }
  }
});

function sendMessagePromise(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, resolve);
  });
}

function injectTranslatedText(tabId, translatedText) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
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
