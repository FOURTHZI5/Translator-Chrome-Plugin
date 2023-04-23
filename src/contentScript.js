const { Configuration, OpenAIApi } = require("openai");
const { createPopper } = require("@popperjs/core");

const configuration = new Configuration({
  apiKey: openAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "translate-button-clicked") {
    try {
      const streamResponse = await openai.createCompletion(
        {
          model: "text-davinci-003",
          prompt: `Translate the following text into Chinese, keep the format:\n---------------------------\n\n${request.text}`,
          temperature: 0.3,
          max_tokens: 1000,
          stream: true,
        },
        { responseType: "stream" }
      );
      // console.log("stream data", streamResponse.data);

      const range = window.getSelection().getRangeAt(0);
      const referenceElement = range.startContainer.parentElement;

      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";

      const arrow = document.createElement("div");
      arrow.className = "arrow";
      tooltip.appendChild(arrow);

      document.body.appendChild(tooltip);

      document.addEventListener("click", function (event) {
        if (tooltip.parentNode && !tooltip.contains(event.target)) {
          tooltip.parentNode.removeChild(tooltip);
        }
      });

      let data = "";
      for await (const chunk of streamResponse) {
        data += chunk;
        console.log(chunk);
        // Handle the received data here
      }
      console.log("data", data);

      // stream.data.on("data", (data) => {
      //   const response = JSON.parse(data.toString());
      //   const translatedText = response.choies[0].text;
      //   console.log(translatedText);

      //   tooltip.textContent = translatedText;
      // });

      // stream.data.on("error", (error) => {
      //   console.log("Failed to translate the text:", error);
      //   sendResponse({ error: error.message });
      // });

      // stream.data.on("end", () => {
      //   console.log("Translation completed");
      //   sendResponse("Translation completed");
      // });

      // createPopper(referenceElement, tooltip, {
      //   placement: "bottom",
      //   modifiers: [
      //     {
      //       name: "offset",
      //       options: {
      //         offset: ({ placement, reference, popper }) => {
      //           if (placement === 'bottom') {
      //             return [0, popper.height / 2];
      //           } else {
      //             return [];
      //           }
      //         },
      //       },
      //     },
      //   ],
      // });
      console.log("Translation completed");
    } catch (error) {
      console.log("Failed to translate the text:", error);
      sendResponse({ error: error.message });
    }

    return true; // Return true to indicate that the response will be sent asynchronously
  }
});

async function createTranslationStream(text, language = "Chinese") {
  const prompt = `Translate the following text into ${language}, keep the format:\n---------------------------\n\n${text}`;

  try {
    const stream = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 1000,
      stream: true,
    });
    return stream;
  } catch (error) {
    console.log("Failed to create the stream:", error);
    throw error;
  }
}
