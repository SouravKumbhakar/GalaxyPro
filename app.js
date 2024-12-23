document.addEventListener('DOMContentLoaded', function() {
    const lightIcon = document.getElementById('lightIcon');
    const solarIcon = document.getElementById('solarIcon');
    const darkIcon = document.getElementById('darkIcon');
    const body = document.body;
    const navbar = document.querySelector('.navbar');
  
    // Function to remove active class from all theme buttons
    function removeActiveClass() {
      lightIcon.classList.remove('active');
      solarIcon.classList.remove('active');
      darkIcon.classList.remove('active');
    }
  
    // Function to set light theme
    function setLightTheme() {
      removeActiveClass();  // Remove 'active' class from all
      lightIcon.classList.add('active');  // Add 'active' class to the light theme button
      body.style.backgroundColor = 'white'; // White background for light theme
      navbar.style.backgroundColor = '#f8f9fa'; // Light navbar background
      document.getElementById('head-line').style.color = "black"
      document.querySelectorAll('.detail-p').forEach((e)=>{
        e.style.color = "black"
      })  
      localStorage.setItem('theme', 'light'); // Store light theme in localStorage
    }
  
    // Function to set solar theme (bluish gradient)
    function setSolarTheme() {
      removeActiveClass();  // Remove 'active' class from all
      solarIcon.classList.add('active');  // Add 'active' class to the solar theme button
      body.style.background = 'linear-gradient(to right, #00c6ff, #0072ff)'; // Bluish gradient
      navbar.style.backgroundColor = '#0072ff'; // Solar navbar color
      localStorage.setItem('theme', 'solar'); // Store solar theme in localStorage
    }
  
    // Function to set dark theme (default)
    function setDarkTheme() {
      removeActiveClass();  // Remove 'active' class from all
      darkIcon.classList.add('active');  // Add 'active' class to the dark theme button
      // Only change the navbar background color for the dark theme, not the body background
      navbar.style.backgroundColor = '#333'; // Dark navbar background
      if (body.style.backgroundColor !== 'rgb(18, 18, 18)') {
        body.style.backgroundColor = '#121212'; // Dark background for body
      }
      localStorage.setItem('theme', 'dark'); // Store dark theme in localStorage
    }
  
    // Event listeners for theme icons
    lightIcon.addEventListener('click', setLightTheme);
    solarIcon.addEventListener('click', setSolarTheme);
    darkIcon.addEventListener('click', setDarkTheme);
  
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      setLightTheme(); // Set light theme if saved
    } else if (savedTheme === 'solar') {
      setSolarTheme(); // Set solar theme if saved
    } else {
      setDarkTheme(); // Set dark theme as default
    }
  });
  