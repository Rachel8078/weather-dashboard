var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var currentDate = document.querySelector("#date");
var forecastEl = document.querySelector("#forecast");
var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
var prevSearchesEl = document.querySelector("#previous-searches")
var searchedCities = [];

// load saved tasks from localStorage
var loadPrevious = function() {
    searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
}

var createPrevSearchListEl = function() {
    // create a container
    var prevCityEl = document.createElement("div");
    prevCityEl.classList = "prev-searches";

    for (let i = 0; i < searchedCities.length; i++) {
        var city = searchedCities[i];

        // create a button for each city
        var prevCity = document.createElement("button");
        prevCity.textContent = city;
        prevCity.addEventListener("click", cityBtnHandler);

        // append to container
        prevCityEl.appendChild(prevCity);

        // append to dom
        prevSearchesEl.appendChild(prevCityEl);  
    }
};

var savedSearches = function(city) {
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}

var getCityWeather = function(city) {
    // format the openweather api url 
    var apiUrl = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial&appid=27a59f8bd30e6e7abc6922ea28ba664e";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data);
            console.log(data);
        });
    });
};

var getForecast = function(city) {
    // format the openweather api url
    var apiForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=27a59f8bd30e6e7abc6922ea28ba664e";

    // fetch 5-day forecast
    fetch(apiForecast).then(function(response) {
        if (response.ok) {
        response.json().then(function(data) {
            displayForecast(data);       
    })}
})};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if(city) {
        searchedCities.unshift(city);
        savedSearches();
        getCityWeather(city);
        getForecast(city);
        cityInputEl.value = "";
        // loadPrevious();
        // createPrevSearchListEl();

    } else {
        alert("Please enter a valid city name");
    }

};

var displayForecast = function(data) {
    // clear old content
    forecastEl.textContent = ""; 

    for (var i = 0; i < data.list.length; i=i+8) {
        var day = data.list[i].dt_txt;
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var icon = data.list[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png"

        // create a container for each day
        var forecast5DayEl = document.createElement("div");
        forecast5DayEl.classList = "forecastdays";

        // create a p element for each data item
        var forecastDayEl = document.createElement("p");
        forecastDayEl.textContent = day.slice(0,10);
        forecastDayEl.classList = "forecastdt";
        var forecastIconEl = document.createElement("img");
        forecastIconEl.setAttribute('src', iconUrl)
        var forecastTempEl = document.createElement("p");
        forecastTempEl.textContent = "Temp: " + temp + "\u00B0F";
        var forecastWindEl = document.createElement("p");
        forecastWindEl.textContent = "Wind: " + wind + " MPH";
        var forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + humidity + "%";
        

        // append to container
        forecast5DayEl.appendChild(forecastDayEl);
        forecast5DayEl.appendChild(forecastIconEl);
        forecast5DayEl.appendChild(forecastTempEl);
        forecast5DayEl.appendChild(forecastWindEl);
        forecast5DayEl.appendChild(forecastHumidityEl);

        // append container to the dom
        forecastEl.appendChild(forecast5DayEl);
    };
};

var displayWeather = function(data) {
    // clear old content
    currentWeatherEl.textContent = "";

    var city = data.list[0].name;
    var temp = data.list[0].main.temp;
    var wind = data.list[0].wind.speed;
    var humidity = data.list[0].main.humidity;
    var icon = data.list[0].weather[0].icon;
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png"

    // create a container
    var currentConditionsEl = document.createElement("div");
    currentConditionsEl.classList = "current-temp";
    
    // create a p
    var cityEl = document.createElement("h2");
    cityEl.textContent = city + " (" + date + ") ";
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperture: " + temp + "\u00B0F";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + wind + " MPH"
    var humidEl = document.createElement("p");
    humidEl.textContent = "Humidity: " + humidity + "%";

    // append to container
    cityEl.appendChild(iconEl);
    currentConditionsEl.appendChild(cityEl);
    currentConditionsEl.appendChild(tempEl);
    currentConditionsEl.appendChild(windEl);
    currentConditionsEl.appendChild(humidEl);

    // append to main element
    currentWeatherEl.appendChild(currentConditionsEl);
}

var cityBtnHandler = function(event) {
    // when the city buttons are clicked, that city weather will load
    if (event.target.nodeName == "BUTTON") {
        var city = event.target.textContent;
        console.log(city);
    }
    getCityWeather(city);
    getForecast(city);
};

searchFormEl.addEventListener("submit", formSubmitHandler);
loadPrevious();
createPrevSearchListEl();
