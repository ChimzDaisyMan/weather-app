import axios from 'axios';

const API_KEY = '67c87e6fe987f82548c1b95764370c52';

export const getCityWeather = async (city) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );

  return response.data;
};
