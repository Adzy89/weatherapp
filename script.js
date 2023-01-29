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
    const response = await fetch("api.openweathermap.org/data/2.5/forecast?q="+town+" &appid" + APIkey);
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
  
  function fiveDayWeather(data) {
    const dateDisplay = moment();
  
    for (let i = 0; i < 5; i++) {
      const card = document.createElement('div');
      card.className = 'col text-light mr-2 bg-custom';
  
      const date = document.createElement('h4');
      date.classList.add('row');
  
      const img = document.createElement('img');
      img.src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
      img.classList.add('row');
  
      const futureConditions = document.createElement('ul');
      futureConditions.classList.add('row');
  
      const futureTemp = document.createElement('li');
      const futureWind = document.createElement('li');
      const futureHumidity = document.createElement('li');
  
      const nextDate = dateDisplay.add(1, 'day');
      date.textContent = nextDate.format('DD/MM/YYYY');
      futureTemp.textContent = `Temp: ${data.daily[i].temp.day} \xB0F`;
      futureWind.textContent = `Wind: ${data.daily[i].wind_speed} MPH`;
      futureHumidity.textContent = `Humidity: ${data.daily[i].humidity} %`;
  
      forecast.appendChild(card);
      card.appendChild(date);
      card.appendChild(img);
      card.appendChild(futureConditions);
      futureConditions.appendChild(futureTemp);
      futureConditions.appendChild(futureWind);
      futureConditions.appendChild(futureHumidity);
    }
  }
  
  function render() {
    const weatherHistory = JSON.parse(localStorage.getItem("weatherSearch"));
    searchHistory = weatherHistory || [];
    historyList.innerHTML = "";
    addBtn(searchHistory);
  }
  
  function addBtn(town) {
    for (let j = 0; j < town.length; j++) {
      const button = document.createElement("button");
      button.innerHTML = town[j];
      button.className = "btn btn-secondary btn-block historyBtn";
      historyList.appendChild(button);
    }
  }
  
  function UvColorCoder(index, UV) {
    switch (true) {
      case index < 3:
        UV.className = "favourable";
        break;
      case index >= 3 && index < 5:
        UV.className = "moderate";
        break;
      case index >= 5:
        UV.className = "severe";
        break;
    }
    return UV;
  }
  
  render();

  submitBtn.addEventListener("click", () => {
    const city = citySearch.value.trim();
    search(city);
  });
  
  historyList.addEventListener("click", (event) => {
    const element = event.target;
    if (element.matches("button")) {
      const city = element.innerText;
      search(city);
    }
  });
  