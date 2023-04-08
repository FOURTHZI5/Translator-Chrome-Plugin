const { Configuration, OpenAIApi } = require("openai");

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
console.log("API Key:", openAI_API_KEY);

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

console.log("Openai config:", openai);
async function runTranslation() {
  const first_translatedText = await translateText("Hello world");
  console.log("First translation:", first_translatedText);
}

runTranslation();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "translate-button-clicked") {
    translateText(request.text).then((translatedText) => {
      console.log("Translated text:", translatedText);
      sendResponse({ translatedText: translatedText });
    });
  }
  return true;
});

async function translateText(text, language = "Chinese") {
  const prompt = `Translate this into ${language}:\n\n${text}\n\n`;

  console.log("prompt", prompt);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const data = response.data;
    console.log("Data:", data);

    if (data && data.choices && data.choices.length > 0) {
      console.log("Translated text:", data.choices[0].text);
      return data.choices[0].text;
    } else {
      return "Translation failed. Please try again.";
    }
  } catch (error) {
    console.log("Failed to query the openAI, find error:", error);
  }
}
