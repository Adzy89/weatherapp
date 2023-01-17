const APIkey = 'fb19bb785d86cc15348d03d93ec22495';
var submitBtn = document.querySelector('#submit-btn');
var current = document.querySelector('#today');
var forecast = document.querySelector('#fiveDay-forecast');
var historyList = document.querySelector('#search-history')
var citySearch = document.querySelector('#search-city');
var displayDate= moment();
var searchHistory = [];

//setting up local storage based on search history
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
//fecthing the co-ordinates from the localised search 
function coordinates(town){
    let weatherCall = "api.openweathermap.org/data/2.5/forecast?q="+town+" &appid" + APIkey;

    for(weatherCall){
        fetch("https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid"+ APIkey);
        .then((response) => response.json());
        .then((data) => console.log(data));

    }
}