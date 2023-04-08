const { Configuration, OpenAIApi } = require("openai");

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
console.log('API Key:', openAI_API_KEY);

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

chrome.contextMenus.create({
  id: 'translate-selection',
  title: '翻译选中文本',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate-selection') {
    translateText(info.selectionText).then((translatedText) => {
      replaceSelectedText(translatedText);
      console.log('Translated text:', translatedText)
      navigator.clipboard.writeText(translatedText); // 复制翻译结果到剪贴板
    });
  }
});

async function translateText(text, language = 'Chinese') {
  const prompt = `Translate this into ${language}:\n\n${text}\n\n1.`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 100,
  });

  const data = response.data;
  console.log('Data:', data);

  if (data && data.choices && data.choices.length > 0) {
    return data.choices[0].text;
  } else {
    return 'Translation failed. Please try again.';
  }
}

function replaceSelectedText(translatedText) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(document.createTextNode(translatedText));
  selection.removeAllRanges();
  selection.addRange(range);
}

function translateAndReplaceSelectedText() {
  const selectedText = window.getSelection().toString();
  translateText(selectedText).then((translatedText) => {
    replaceSelectedText(translatedText);
    navigator.clipboard.writeText(translatedText); // 复制翻译结果到剪贴板
  });
}

document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyT') {
    translateAndReplaceSelectedText();
  }
});