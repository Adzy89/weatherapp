// Variables
// API Key
var apiKey = "87958847951be2c7b9a53baa9876f938";
// Search History
var searchHistoryList = [];
// Date using Moment.js
var today = moment().format('L');

// Function for current condition
function currentWeather(city) {
    var currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    $.ajax({
        url: currentWeatherURL,
        method: "GET"
    }).then(function (currentResponse) {
        console.log(currentResponse);
        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        var iconCode = currentResponse.weather[0].icon;
        var weatherIconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        // Display searched city's current weather condition
        // Information includes current weather icon, temperature, humidity, wind speed, and uv index
        var currentCity = $(`
            <h2 id="currentCity">
            ${currentResponse.name} ${today} <img src="${weatherIconURL}" alt="${currentResponse.weather[0].description}" />
            </h2>
            <p>Temperature: ${currentResponse.main.temp} °F</p>
            <p>Humidity: ${currentResponse.main.humidity}\%</p>
            <p>Wind Speed: ${currentResponse.wind.speed} MPH</p>
        `);
        $("#cityDetail").append(currentCity);

        // Display current UV index
        var lat = currentResponse.coord.lat;
        var lon = currentResponse.coord.lon;
        var uviURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        $.ajax({
            url: uviURL,
            method: "GET"
        }).then(function (uviResponse) {
            console.log(uviResponse);
            var uvIndex = uviResponse.value;
            var uvIndexP = $(`
                <p>UV Index:
                <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
                </p>
            `);
            $("#cityDetail").append(uvIndexP);

            futureWeather(lat, lon);

            // Display UV index color to indicate condition
            // Current condition can be favorable (0-2, green), moderate (3-5, yellow), or severe (6-7 orange; 8-10, red; 11+, violet)
            if (uvIndex >= 0 && uvIndex <= 2.99) {
                $("#uvIndexColor").css("background-color", "#3ea72d").css("color", "white");
            } else if (uvIndex >= 3 && uvIndex <= 5) {
                $("#uvIndexColor").css("background-color", "#fff300");
            } else if (uvIndex >= 5 && uvIndex <= 7.99) {
                $("#uvIndexColor").css("background-color", "#f18b00");
            } else if (uvIndex >= 7 && uvIndex <= 10) {
                $("#uvIndexColor").css("background-color", "#e53210").css("color", "white");
            } else {
                $("#uvIndexColor").css("background-color", "#b300b3").css("color", "white");
            };
        });
    });
}

// Function for 5-Day Weather Forecast
function futureWeather(lat, lon) {

    var futureWeatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    //`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
    $.ajax({
        url: futureWeatherURL,
        method: "GET"
    }).then(function (futureResponse) {
        console.log(futureResponse);
        $("#fiveDay").empty();
        for (let i = 1; i < 6; i++) {
            var cityInfo = {
                date: futureResponse.daily[i].dt,
                icon: futureResponse.daily[i].weather[0].icon,
                temp: futureResponse.daily[i].temp.day,
                wind_speed: futureResponse.daily[i].wind_speed,
                humidity: futureResponse.daily[i].humidity
            };
            var currentDate = moment.unix(cityInfo.date).format("MM/DD/YYYY");
            var weatherIconURL = `<img src="https://openweathermap.org/img/w/${cityInfo.icon}.png" alt="${futureResponse.daily[i].weather[0].main}" />`;
            
            // Display weather forecast for the next five days
            // Future weather information includes weather icon, temperature, wind speed, and humidity
            var futureWeatherCard = $(`
                <div class="pl-3">
                <div class="card pl-3 pt-3 mb-3 bg text-light" style="width: 12rem;>
                <div class="card-body">
                <h5>${currentDate}</h5>
                <p>${weatherIconURL}</p>
                <p>Temp: ${cityInfo.temp} °F</p>
                <p> Wind: ${cityInfo.wind_speed} MPH</p>
                <p>Humidity: ${cityInfo.humidity}\%</p>
            </div>
        </div>
    <div>
`);
            $("#fiveDay").append(futureWeatherCard);
        }
    });
}

// Event listener
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var city = $("#enterCity").val().trim();
    currentWeather(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
        `);

        // Display search history/searched cities  
        $("#searchHistory").append(searchedCity);
    };

    // Searched cities are stored in localStorage
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

// Display a city's current and future weather conditions when clicked from the search history list 
$(document).on("click", ".list-group-item", function () {
    var listCity = $(this).text();
    currentWeather(listCity);
});

// Display the the last searched city's weather conditions when the application is opened
$(document).ready(function () {
    var searchHistoryArray = JSON.parse(localStorage.getItem("city"));
    if (searchHistoryArray !== null) {
        var lastSearchedIndex = searchHistoryArray.length - 1;
        var lastSearchedCity = searchHistoryArray[lastSearchedIndex];
        currentWeather(lastSearchedCity);
        console.log(`Last searched city: ${lastSearchedCity}`);
    }
});