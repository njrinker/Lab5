// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

// Define canvas to display meme on
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');

// Define variables for input text
const text_top = document.getElementById('text-top');
const text_bottom = document.getElementById('text-bottom');

// Get form submission input
const form = document.getElementById('generate-meme');

// Variables for buttons and voice selection choice
const generate_btn = document.querySelector('button[type=submit]');
const clear_btn = document.querySelector('button[type=reset]');
const read_btn = document.querySelector('button[type=button]');
const voice = document.getElementById('voice-selection');
const volume = document.querySelector('input[type=range]');

// Declare the synth variable for text to speech
let synth = window.speechSynthesis;
let voices = [];
let voicesAdded = false;
let utterance;

// Gets the url for the inputted image
const img_add = document.getElementById('image-input');
img_add.addEventListener('change', () => {
  img.src = "images/" + document.getElementById('image-input').files[0].name;
})
// Event listener for form submission to add text to canvas
form.addEventListener('submit', () => {
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.font = '48px fantasy';
  writeFunction();
  event.preventDefault();
  toggleButtons();
  if (voicesAdded == false) {
    populateVoiceList();
  }
  utterance = new SpeechSynthesisUtterance(text_top.value + text_bottom.value);
})
// Event listener to clear the canvas when the clear button is clicked
clear_btn.addEventListener('click', () => {
  toggleButtons();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})
// Helper function to write text to canvas
function writeFunction() {
  ctx.textBaseline = 'top';
  ctx.fillText(text_top.value, canvas.width/2, 0);
  ctx.strokeText(text_top.value, canvas.width/2, 0);
  ctx.textBaseline = 'bottom';
  ctx.fillText(text_bottom.value, canvas.width/2, canvas.height);
  ctx.strokeText(text_bottom.value, canvas.width/2, canvas.height);
}
// Helper function to toggle the buttons on the form depending on the context
function toggleButtons() {
  if (generate_btn.disabled == false) {
    generate_btn.disabled = true;
    clear_btn.disabled = false;
    read_btn.disabled = false;
    voice.disabled = false;
  }
  else {
    generate_btn.disabled = false;
    clear_btn.disabled = true;
    read_btn.disabled = true;
    voice.disabled = true;
  }
}
// Function to populate the voice list selector
function populateVoiceList() {
  voices = synth.getVoices();
  for(let i = 0; i < voices.length ; i++) {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
      option.setAttribute('selected', '');
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voice.appendChild(option);
    option.innerText = voices[i].name;
  }
  voicesAdded = true;
  voice.remove(0);
}
// Event listener that reads aloud the meme text when the read aloud button is pressed
read_btn.addEventListener('click', () => {
  let selectedOption = voice.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterance.voice = voices[i];
    }
  }
  utterance.volume = volume.value/100;
  window.speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
})
// Event listener that changes the displayed icon for the volume slider when it is changed
volume.addEventListener('change', () => {
  let volumeDiv = document.getElementById('volume-group');
  let volumeIcon = volumeDiv.getElementsByTagName('img')[0];
  if (volume.value >= 67) {
    volumeIcon.src = "icons/volume-level-3.svg"; 
  }
  else if (volume.value >= 34) {
    volumeIcon.src = "icons/volume-level-2.svg";
  }
  else if (volume.value >= 1) {
    volumeIcon.src = "icons/volume-level-1.svg";
  }
  else {
    volumeIcon.src = "icons/volume-level-0.svg";
  }
})

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // Sets the background of the canvas to be black
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Gets the appropriate dimensions for the image and draws the image
  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
