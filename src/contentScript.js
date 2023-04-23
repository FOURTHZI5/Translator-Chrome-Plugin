import axios from "axios";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "translate-button-clicked" && request.text !== "") {
    console.log("create the popup window");
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    var popup = document.createElement('div');
    popup.innerHTML = '...';
    popup.classList.add('popup');
    const width = rect.right - rect.left;
    console.log(rect.right, rect.left);
    console.log("width: " + width);
    popup.style.maxWidth = (width * 1.25) + 'px';
    popup.style.top = (rect.bottom + 8) + 'px';
    popup.style.left = (rect.left + width / 2) + 'px';
    console.log("append the poppup window")
    document.body.appendChild(popup);

    const clickListener = function(event) {
      if (popup.parentNode && !popup.contains(event.target)) {
        popup.parentNode.removeChild(popup);
        // Remove the listener when the user clicks
        document.removeEventListener("click", clickListener);
      }
    };

    document.addEventListener("click", clickListener);

    try {
      await handleTranslatedText(request.text, "Chinese", (data) => {
        popup.innerHTML = data;
      });
      console.log("Translation completed");
    } catch (error) {
      console.log("Failed to translate the text:", error);
      sendResponse({ error: error.message });
    }

    return true; // Return true to indicate that the response will be sent asynchronously
  }
});

async function handleTranslatedText(text, language = "Chinese", onDataReceived) {
  const translation = translateText(text, language);

  let data = "";
  for await (const chunk of translation) {
    data += chunk;
    onDataReceived(data);
  }
  console.log(data);
  return data;
}

async function* translateText(text, language) {
  const prompt = `Translate the following text into ${language}, keep the format:\n---------------------------\n\n${text}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openAI_API_KEY}`,
  };

  const requestBody = JSON.stringify({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 1000,
    stream: true,
  });

  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    requestBody,
    { headers }
  );

  let data = "";

  for await (const chunk of response.data) {
    data += chunk;

    if (chunk === '\n') {
      data = data.trim();

      if (data.endsWith('data: [DONE]')) {
        break;
      }

      if (data) {
        console.log(data);
        const jsonObject = JSON.parse(data.substring(6));
        const processedData = jsonObject.choices[0]?.text;

        if (processedData) {
          yield processedData;
        }
      }

      data = "";
    }
  }
}
