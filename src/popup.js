document.addEventListener("DOMContentLoaded", function () {
  var toggleSwitch = document.getElementById("toggleSwitch");

  // Read the stored value and set the checkbox state accordingly
  chrome.storage.sync.get("switch", function (items) {
    toggleSwitch.checked = items.switch ?? true;
  });

  // Update the stored value when the checkbox is toggled
  toggleSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({ switch: toggleSwitch.checked });
  });

  document.getElementById("update_button").addEventListener("click", function() {
    // Get the API key from the input element
    var apiKey = document.getElementById("api_key").value;
  
    // Save the API key to the Chrome storage
    chrome.storage.sync.set({"apiKey": apiKey}, function() {
      // Notify the user that the API key has been saved
      alert("API key updated!");
    });
  });
});