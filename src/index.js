import './css/style.scss';
import { getCityWeather } from './api.js';

// Function to display or hide loader
const toggleLoader = (show) => {
  const loader = document.getElementById('loader');
  const renderWeather = document.getElementById('weather-display');

  if (loader && renderWeather) {
    loader.style.display = show ? 'block' : 'none'; // Show loader if 'show' is true, hide otherwise
    if (loader.style.display === 'block') {
      renderWeather.style.display = 'none';
    } else {
      renderWeather.style.display = 'block';
    }
  }
};

// Function to display weather data
const displayStoredWeatherData = (data) => {
  const storedData = localStorage.getItem('weatherData');
  const renderWeather = document.getElementById('weather-display');

  toggleLoader(false); // Hide loader when data is ready

  // If we have new API data, display it, otherwise use stored data
  const weatherData = data || (storedData ? JSON.parse(storedData) : null);

  if (weatherData) {
    renderWeather.innerHTML = `
      <div class="weather-data">
        <h1>Weather in ${weatherData.name}</h1>
        <p><strong>Temperature:</strong> ${(
          weatherData.main.temp - 273.15
        ).toFixed(2)}°C </p>
        <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s</p>
        <p><strong>Pressure:</strong> ${
          weatherData.main.pressure
        } hPa (Sea level)</p>
        <p><strong>Visibility:</strong> ${weatherData.visibility} meters</p>
      </div>`;
  } else {
    renderWeather.innerHTML = '<p>No weather data available.</p>';
  }
};

// Function to fetch weather data and store it
const sendWeatherData = () => {
  const city = document.getElementById('weather-box');

  if (city) {
    city.addEventListener('change', async (e) => {
      e.preventDefault();

      const cityName = e.target.value.trim();
      if (cityName) {
        try {
          toggleLoader(true); // Show loader before fetching data

          const data = await getCityWeather(cityName); // Fetch weather data

          if (data) {
            displayStoredWeatherData(data); // Display fetched data
            localStorage.setItem('weatherData', JSON.stringify(data)); // Store data in localStorage
            e.target.value = '';
          } else {
            console.error('No weather data found for the city.');
          }
        } catch (error) {
          console.error('Error fetching weather data:', error);
        } finally {
          toggleLoader(false); // Ensure loader is hidden even if an error occurs
        }
      }
    });
  } else {
    console.log('No city input element detected.');
  }
};

// Initial function calls
sendWeatherData();

// Display stored data on page load (if any exists)
const storedData = localStorage.getItem('weatherData');
if (storedData) {
  displayStoredWeatherData(JSON.parse(storedData));
}
