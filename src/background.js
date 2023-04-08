const { Configuration, OpenAIApi } = require("openai");

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
console.log("API Key:", openAI_API_KEY);

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

chrome.contextMenus.create({
  id: "selectedText",
  title: "Translate '%s' to Chinese",
  contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  console.log("Info", info)
  if (info.menuItemId === "selectedText") {
    const selectedText = info.selectionText;
    const translatedText = await translateText(selectedText);
  }
});

async function translateText(text, language = "Chinese") {
  const prompt = `Translate this into ${language}:\n\n${text}\n\n`;

  console.log('prompt', prompt)

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });


    const data = response.data;
    console.log("Data:", data);

    if (data && data.choices && data.choices.length > 0) {
      return data.choices[0].text;
    } else {
      return "Translation failed. Please try again.";
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
