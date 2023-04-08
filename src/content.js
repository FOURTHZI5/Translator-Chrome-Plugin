// console.log('Content script is running');
// const div = document.createElement('div');
// div.innerHTML = 'Hello from content script!';
// document.body.appendChild(div);

function getSelectionText() {
  var text = "";
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    (activeElTagName == "textarea") || (activeElTagName == "input" &&
    /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
    (typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
}

// document.addEventListener("mouseup", function(event) {
//   var selectionText = getSelectionText();
//   if (selectionText) {
//     chrome.runtime.sendMessage({ selectionText: selectionText });
//   }
// });