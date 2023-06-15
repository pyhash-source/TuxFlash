// Retrieve the button name from the URL parameter
var urlParams = new URLSearchParams(window.location.search);
var buttonName = urlParams.get("buttonName");

// Display the button name on the page
var buttonNameElement = document.getElementById("deckName");
buttonNameElement.textContent = buttonName;