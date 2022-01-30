// var city = "Seattle"
var searchFormEl = document.querySelector("#search-form");
var cityInputEl = document.querySelector("#city-search");
var currentWeatherEl = document.querySelector("#current-weather");
var currentDate = document.querySelector("#date");
var forecastEl = document.querySelector("#forecast");
var today = new Date();
var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();

var getCityWeather = function(city) {
    // format the openweather api url 
    var apiUrl = "http://api.openweathermap.org/data/2.5/find?q=" + city + "&units=imperial&appid=27a59f8bd30e6e7abc6922ea28ba664e";

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            displayWeather(data);
        });
    });


};

var getForecast = function(city) {
    // format the openweather api url
    var apiForecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=27a59f8bd30e6e7abc6922ea28ba664e";

    // fetch 5-day forecast
    fetch(apiForecast).then(function(response) {
        response.json().then(function(data) {
            displayForecast(data);
            console.log(data);
        });
    });
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if(city) {
        getCityWeather(city);
        getForecast(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city name");
    }
};

var displayForecast = function(data) {
    // clear old content
    forecastEl.textContent = ""; 

    var day1 = data.list[3].dt_txt;
    console.log(day1.slice(0,10));
    var day1temp = data.list[3].main.temp;
    console.log(day1temp);
    var day1wind = data.list[3].wind.speed;
    console.log(day1wind);
    var day1humidity = data.list[3].main.humidity;
    console.log(day1humidity);
    var day1icon = data.list[3].weather[0].icon;
    console.log(day1icon);

    var day2 = data.list[11].dt_txt;
    console.log(day2);
    var day2temp = data.list[11].main.temp;
    console.log(day2temp);
    var day2wind = data.list[11].wind.speed;
    console.log(day2wind);
    var day2humidity = data.list[11].main.humidity;
    console.log(day2humidity);
    var day2icon = data.list[11].weather[0].icon;
    console.log(day2icon);

}

var displayWeather = function(data) {
    // clear old content
    currentWeatherEl.textContent = "";

    var city = data.list[0].name;
    var temp = data.list[0].main.temp;
    var wind = data.list[0].wind.speed;
    var humidity = data.list[0].main.humidity;
    var icon = data.list[0].weather[0].icon;

    // create a container
    var currentConditionsEl = document.createElement("div");
    currentConditionsEl.classList = "current-temp";
    
    // create a p
    var cityEl = document.createElement("h2");
    cityEl.textContent = city + "(" + date + ")" + icon;
    var tempEl = document.createElement("p");
    tempEl.textContent = "Temperture: " + temp + " degrees F";
    var windEl = document.createElement("p");
    windEl.textContent = "Wind Speed: " + wind + " MPH"
    var humidEl = document.createElement("p");
    humidEl.textContent = "Humidity: " + humidity + "%";

    // append to container
    currentConditionsEl.appendChild(cityEl);
    currentConditionsEl.appendChild(tempEl);
    currentConditionsEl.appendChild(windEl);
    currentConditionsEl.appendChild(humidEl);

    // append to main element
    currentWeatherEl.appendChild(currentConditionsEl);
}

searchFormEl.addEventListener("submit", formSubmitHandler);


