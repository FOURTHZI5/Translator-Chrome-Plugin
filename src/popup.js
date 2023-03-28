const { Configuration, OpenAIApi } = require("openai");

const inputText = document.getElementById('inputText');
const translateButton = document.getElementById('translateButton');
const outputText = document.getElementById('outputText');

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
console.log('API Key:', openAI_API_KEY);

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

translateButton.addEventListener('click', async () => {
  const textToTranslate = inputText.value;
  const translatedText = await translateText(textToTranslate);
  outputText.value = translatedText;
});

async function translateText(text, language = 'Chinese') {
  const prompt = `Translate this into ${language}:\n\n${text}\n\n1.`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 100,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });

  const data = response.data;
  console.log('Data:', data);

  if (data && data.choices && data.choices.length > 0) {
    return data.choices[0].text;
  } else {
    return 'Translation failed. Please try again.';
  }
}