const inputText = document.getElementById('inputText');
const translateButton = document.getElementById('translateButton');
const outputText = document.getElementById('outputText');

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
const apiKey = openAI_API_KEY;
console.log('API Key:', apiKey);

translateButton.addEventListener('click', async () => {
  const textToTranslate = inputText.value;
  const translatedText = await translateText(textToTranslate);
  outputText.value = translatedText;
});

async function translateText(text) {
  const prompt = `Translate the following English text to Chinese: "${text}"`;

  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5
    })
  });

  const data = await response.json();
  console.log(data)

  if (data && data.choices && data.choices.length > 0) {
    return data.choices[0].text.trim();
  } else {
    return 'Translation failed. Please try again.';
  }
}