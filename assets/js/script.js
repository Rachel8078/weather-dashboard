// var city = "Seattle"

var getCityWeather = function(city) {
    // format the openweather api url 
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=27a59f8bd30e6e7abc6922ea28ba664e"

    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

getCityWeather("London");


