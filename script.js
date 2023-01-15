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
}