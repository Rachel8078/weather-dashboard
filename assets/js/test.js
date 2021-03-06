var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var currentDate = document.querySelector("#date");
var forecastEl = document.querySelector("#forecast");
var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
var prevSearchesEl = document.querySelector("#previous-searches")
var cityBtn = document.querySelector(".city-button");

var searchedCities = [];

// load saved tasks from localStorage
var loadPrevious = function() {
    searchedCities = localStorage.getItem("cities");
    searchedCities = JSON.parse(searchedCities);
    createPrevSearchListEl(searchedCities);
}

var createPrevSearchListEl = function() {
    for (let i = 0; i < searchedCities.length; i++) {
        var city = searchedCities[i];

        // create a container
        var prevCityEl = document.createElement("div");
        prevCityEl.classList = "prev-searches";

        // create an element for city
        var prevCity = document.createElement("button");
        prevCity.textContent = city;
        prevCity.classList = "city-button";


        // append to container
        prevCityEl.appendChild(prevCity);

        // append to dom
        prevSearchesEl.appendChild(prevCityEl);        
    }
};

var savedSearches = function(city) {
    localStorage.setItem("cities", JSON.stringify(searchedCities));
}

// test run to get latitude & longitude part 1
var getLatLong = function(city) {
    // format api url
    var apiUrl = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial&appid=27a59f8bd30e6e7abc6922ea28ba664e";
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayLatLong(data);
        });
    });
};
// end test run part 1

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

var cityButtonHandler = function(event) {
    console.log(cityBtn.value);
    var city = cityBtn.value;

    if(city) {
        getCityWeather(city);
        getForecast(city);
    }
};

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if(city) {
        getCityWeather(city);
        getForecast(city);
        cityInputEl.value = "";
        searchedCities.push(city);
        savedSearches();
        getLatLong(city);
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
        //forecast5DayEl.classList = "card";

        // create a p element for each data item
        var forecastDayEl = document.createElement("p");
        forecastDayEl.textContent = split(day,1);
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

// test part 2
var displayLatLong = function(data) {
    var latitude = data.list[0].coord.lat;
    var longitude = data.list[0].coord.lon;
    console.log(latitude);
    console.log(longitude);
}
// end test part 2

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

searchFormEl.addEventListener("submit", formSubmitHandler);

loadPrevious();

//cityBtn.addEventListener("click", cityButtonHandler);