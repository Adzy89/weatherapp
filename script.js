const APIkey = 'fb19bb785d86cc15348d03d93ec22495';
var submitBtn = document.querySelector('#submit-btn');
var current = document.querySelector('#today');
var forecast = document.querySelector('#fiveDay-forecast');
var historyList = document.querySelector('#search-history')
var citySearch = document.querySelector('#search-city');
var displayDate= moment();
var searchHistory = [];

function search(town) {
    forecast.innerHTML = "";
    current.innerHTML = "";
    if (town === "") {
        return;
    }
    if (!searchHistory.includes(town)) {
    searchHistory.push(town);
    localStorage.setItem("weatherSearch", JSON.stringify(searchHistory));
    }
    render();
    fetchlongLat(town)
}


async function fetchlongLat(town) {
    try {
    const response = await fetch("api.openweathermap.org/data/2.5/forecast?q="+town+" &appid" + APIkey;);
    const data = await response.json();
    const lat = data.city.coord.lat;
    const lon = data.city.coord.lon;
    const cityName = data.city.name;
    fetchWeather(lat, lon, cityName);
    } catch (error) {
        console.error(error);
    }
}

async function fetchWeather(lat, lon, APIkey) {
    try {
      const weatherCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${APIkey}&units=imperial`;
      const response = await fetch(weatherCall);
      const data = await response.json();
      currentWeather(data);
      fiveDayWeather(data);
    } catch (error) {
      console.error(error);
    }
  }
  
  function currentWeather(data) {
    const cityName = document.createElement('h3');
    cityName.classList.add('row');
    cityName.textContent = `${searchedCity} (${displayDate.format("DD/MM/YYYY")})`;
    
    const img = document.createElement('img');
    const icon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    img.setAttribute("src", icon);
  
    const conditions = document.createElement('ul');
    conditions.classList.add('column');
  
    const temp = document.createElement('li');
    temp.textContent = `Temp: ${data.current.temp} \xB0F`;
  
    const wind = document.createElement('li');
    wind.textContent = `Wind: ${data.current.wind_speed} MPH`;
  
    const humidity = document.createElement('li');
    humidity.textContent = `Humidity: ${data.current.humidity} %`;
  
    const UV = document.createElement('li');
    UV.textContent = `UV Index: ${data.current.uvi}`;
    UvColorCoder(data.current.uvi, UV);
  
    current.appendChild(cityName);
    current.appendChild(img);
    current.appendChild(conditions);
    conditions.appendChild(temp);
    conditions.appendChild(wind);
    conditions.appendChild(humidity);
    conditions.appendChild(UV);
  }
  