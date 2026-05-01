function initPage() {
    const cityEl = document.getElementById("enter-city");
    const searchEl = document.getElementById("search-button");
    const clearEl = document.getElementById("clear-history");
    const nameEl = document.getElementById("city-name");
    const currentPicEl = document.getElementById("current-pic");
    const currentTempEl = document.getElementById("temperature");
    const currentHumidityEl = document.getElementById("humidity");
    const currentWindEl = document.getElementById("wind-speed");
    const currentUVEl = document.getElementById("UV-index");
    const historyEl = document.getElementById("history");
    const fivedayEl = document.getElementById("fiveday-header");
    const todayweatherEl = document.getElementById("today-weather");

    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "84b79da5e5d7c92085660485702f4ce8";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                // Show today's card
                todayweatherEl.classList.remove("hidden");

                // Parse current weather
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ")";

                let weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute("alt", response.data.weather[0].description);

                currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176;F";
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";

                // UV Index
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                let UVQueryURL =
                    "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat +
                    "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";

                axios.get(UVQueryURL).then(function (response) {
                    const UVIndex = document.createElement("span");
                    const val = response.data[0].value;

                    if (val < 4) {
                        UVIndex.setAttribute("class", "badge badge-success");
                    } else if (val < 8) {
                        UVIndex.setAttribute("class", "badge badge-warning");
                    } else {
                        UVIndex.setAttribute("class", "badge badge-danger");
                    }

                    UVIndex.innerHTML = val;
                    currentUVEl.innerHTML = "UV Index: ";
                    currentUVEl.append(UVIndex);
                });

                // 5-day forecast
                let cityID = response.data.id;
                let forecastQueryURL =
                    "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;

                axios.get(forecastQueryURL).then(function (response) {
                    fivedayEl.classList.remove("hidden");

                    const forecastEls = document.querySelectorAll(".forecast");
                    for (let i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = "";

                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();

                        // Date
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);

                        // Icon
                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute(
                            "src",
                            "https://openweathermap.org/img/wn/" +
                            response.data.list[forecastIndex].weather[0].icon + "@2x.png"
                        );
                        forecastWeatherEl.setAttribute(
                            "alt",
                            response.data.list[forecastIndex].weather[0].description
                        );
                        forecastEls[i].append(forecastWeatherEl);

                        // Temp
                        const forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML =
                            "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176;F";
                        forecastEls[i].append(forecastTempEl);

                        // Humidity
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML =
                            "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                });
            });
    }

    // Search button
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value.trim();
        if (!searchTerm) return;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    });

    // Allow Enter key to trigger search
    cityEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") searchEl.click();
    });

    // Clear history
    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        renderSearchHistory();
    });

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = searchHistory.length - 1; i >= 0; i--) {
            const historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            });
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
}

initPage();