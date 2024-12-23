const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

// Update active slide
function updateCarousel() {
    const width = slides[0].clientWidth;
    carousel.style.transform = `translateX(${-currentIndex * width}px)`;
}

// Next button functionality
nextButton.addEventListener('click', nextSlide);

// Previous button functionality
prevButton.addEventListener('click', prevSlide);

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
}

// Drag functionality
carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - currentTranslate;
    carousel.style.cursor = 'grabbing';
});

carousel.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const x = e.pageX - startX;
        currentTranslate = x;
        carousel.style.transform = `translateX(${x}px)`;
    }
});

carousel.addEventListener('mouseup', handleDragEnd);
carousel.addEventListener('mouseleave', handleDragEnd);

function handleDragEnd() {
    if (isDragging) {
        isDragging = false;
        carousel.style.cursor = 'grab';

        const width = slides[0].clientWidth;
        currentIndex = Math.round(-currentTranslate / width);
        currentTranslate = -currentIndex * width;
        updateCarousel();
    }
}

// Prevent text selection during drag
carousel.addEventListener('dragstart', (e) => e.preventDefault());

// Initialize carousel position
updateCarousel();

// Auto slide functionality
let autoSlideInterval = setInterval(nextSlide, 4000); // Slides every 5 seconds

// Pause auto slide on user interaction
carousel.addEventListener('mousedown', pauseAutoSlide);
carousel.addEventListener('mousemove', pauseAutoSlide);
nextButton.addEventListener('click', pauseAutoSlide);
prevButton.addEventListener('click', pauseAutoSlide);

function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 5000); // Resume after interaction
}

// "Click More" button functionality
document.querySelectorAll('.more-button').forEach((button) => {
  button.addEventListener('click', (e) => {
      const topic = e.target.closest('.slide').dataset.topic;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(topic)}`, '_blank');
  });
});

// Like button functionality
document.querySelectorAll('.like-button').forEach((button) => {
  button.addEventListener('click', (e) => {
      const slide = e.target.closest('.slide');
      const likeCountElement = slide.querySelector('.like-count');
      const topic = slide.dataset.topic;
      let count = parseInt(likeCountElement.textContent);

      count++;
      likeCountElement.textContent = count;

      // Store the updated like count in local storage
      localStorage.setItem(`likeCount-${topic}`, count);
  });
});

// Initialize carousel on load
updateCarousel();

// JOKES ON CAT
// Cat Joke Generator and Submission Section
const jokeDisplay = document.getElementById("jokeDisplay");
const fetchJokeButton = document.getElementById("fetchJoke");
const jokeForm = document.getElementById("jokeForm");
const userJokeDisplay = document.getElementById("userJokeDisplay");

let userJokes = JSON.parse(localStorage.getItem("userJokes")) || []; // Load jokes from local storage
let userJokeIndex = 0;

// Fetch a random cat joke from an API
async function fetchCatJoke() {
  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random?category=animal");
    const data = await response.json();
    jokeDisplay.textContent = data.value;
  } catch (error) {
    jokeDisplay.textContent = "Could not fetch a joke. Please try again later!";
  }
}

// Display the next user-submitted joke
function displayUserJoke() {
  if (userJokes.length > 0) {
    userJokeDisplay.textContent = `"${userJokes[userJokeIndex].joke}" - ${userJokes[userJokeIndex].name}`;
    userJokeIndex = (userJokeIndex + 1) % userJokes.length;
  } else {
    userJokeDisplay.textContent = "No user-submitted jokes yet!";
  }
}

// Submit a new joke
jokeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userJoke = document.getElementById("userJoke").value;
  const userName = document.getElementById("userName").value;

  if (userJoke && userName) {
    const newJoke = { joke: userJoke, name: userName };
    userJokes.push(newJoke);
    localStorage.setItem("userJokes", JSON.stringify(userJokes)); // Save to local storage
    jokeForm.reset();
    displayUserJoke();
  }
});

// Event listener for fetching a new joke
fetchJokeButton.addEventListener("click", fetchCatJoke);

// Initial joke fetch and user joke display
fetchCatJoke();
displayUserJoke();

// Rotate user jokes every 5 seconds
setInterval(displayUserJoke, 5000);

