const { Configuration, OpenAIApi } = require("openai");
const { createPopper } = require("@popperjs/core");

// 将YOUR_API_KEY替换为您的实际Chat GPT API密钥
// console.log("API Key:", openAI_API_KEY);

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// console.log("Openai config:", openai);
// async function runTranslation() {
//   const first_translatedText = await translateText("Hello world");
//   console.log("First translation:", first_translatedText);
// }

// runTranslation();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "translate-button-clicked") {
    // console.log("Popper script executed");

    try {
      const translatedText = await translateText(request.text);
      // console.log("Translated text:", translatedText);
      const range = window.getSelection().getRangeAt(0);
      const referenceElement = range.startContainer.parentElement;
      const tooltip = document.createElement("div");
      tooltip.textContent = translatedText;
      tooltip.className = "tooltip";

      const arrow = document.createElement("div");
      arrow.className = "arrow";
      tooltip.appendChild(arrow);

      document.body.appendChild(tooltip);

      document.addEventListener("click", function(event) {
        if (tooltip.parentNode && !tooltip.contains(event.target)) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });

      createPopper(referenceElement, tooltip, {
        placement: "bottom",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: ({ placement, reference, popper }) => {
                if (placement === 'bottom') {
                  return [0, popper.height / 2];
                } else {
                  return [];
                }
              },
            },
          },
        ],
      });

      sendResponse("Translation completed");
    } catch (error) {
      console.log("Failed to translate the text:", error);
      sendResponse({ error: error.message });
    }

    return true; // Return true to indicate that the response will be sent asynchronously
  }
});

async function translateText(text, language = "Chinese") {
  const prompt = `Translate the following text into ${language}, keep the format:\n---------------------------\n\n${text}`;

  // console.log("prompt", prompt);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const data = response.data;
    // console.log("Data:", data);

    if (data && data.choices && data.choices.length > 0) {
      const translatedText = data.choices[0].text;
      // console.log("Translated text:", translatedText);
      return translatedText;
    } else {
      return "Translation failed. Please try again.";
    }
  } catch (error) {
    console.log("Failed to query the OpenAI API:", error);
    throw error;
  }
}
