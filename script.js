function initPage() {
    // DOM Elements
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
    const descriptionEl = document.getElementById("weather-description");
    const feelsLikeEl = document.getElementById("feels-like");
    const windDirectionEl = document.getElementById("wind-direction");
    const visibilityEl = document.getElementById("visibility");
    const pressureEl = document.getElementById("pressure");
    const dewPointEl = document.getElementById("dew-point");
    const cloudinessEl = document.getElementById("cloudiness");
    const sunriseEl = document.getElementById("sunrise");
    const sunsetEl = document.getElementById("sunset");
    const loadingEl = document.getElementById("loading");
    const errorMessageEl = document.getElementById("error-message");
    const errorTextEl = document.getElementById("error-text");

    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    const APIKey = "0151e114e1b63a6976b975160d604dcf";

    // Helper Functions
    function showLoading() {
        loadingEl.classList.remove("hidden");
        errorMessageEl.classList.add("hidden");
    }

    function hideLoading() {
        loadingEl.classList.add("hidden");
    }

    function showError(message) {
        errorTextEl.textContent = message;
        errorMessageEl.classList.remove("hidden");
        todayweatherEl.classList.add("hidden");
        fivedayEl.classList.add("hidden");
    }

    // Convert Kelvin to Fahrenheit
    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    // Convert Kelvin to Celsius
    function k2c(K) {
        return Math.floor(K - 273.15);
    }

    // Convert wind degrees to cardinal direction
    function getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                           'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return directions[index];
    }

    // Format Unix timestamp to time string
    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Get weather icon URL with fallback
    function getWeatherIconUrl(iconCode) {
        if (iconCode) {
            return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        }
        // Return placeholder icon if no icon code available
        return "https://openweathermap.org/img/wn/50d@2x.png";
    }

    // Main weather function
    function getWeather(cityName) {
        if (!cityName || cityName.trim() === "") {
            showError("Please enter a valid city name");
            return;
        }

        showLoading();
        
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${APIKey}`;
        
        axios.get(queryURL)
            .then(function (response) {
                hideLoading();
                todayweatherEl.classList.remove("hidden");

                // Format date
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = `${response.data.name} (${month}/${day}/${year})`;

                // Weather icon and description
                let weatherPic = response.data.weather[0]?.icon;
                currentPicEl.setAttribute("src", getWeatherIconUrl(weatherPic));
                currentPicEl.setAttribute("alt", response.data.weather[0]?.description || "Weather icon");
                descriptionEl.innerHTML = response.data.weather[0]?.description || "No description";
                
                // Get current weather icon ID for potential custom mapping
                const weatherId = response.data.weather[0]?.id;
                console.log("Weather condition ID:", weatherId); // For debugging - can map to custom icons

                // Temperature data
                const tempF = k2f(response.data.main.temp);
                const tempC = k2c(response.data.main.temp);
                const feelsLikeF = k2f(response.data.main.feels_like);
                const feelsLikeC = k2c(response.data.main.feels_like);
                const minTempF = k2f(response.data.main.temp_min);
                const maxTempF = k2f(response.data.main.temp_max);
                
                currentTempEl.innerHTML = `${tempF}°F / ${tempC}°C<br><small>↓${minTempF}° ↑${maxTempF}°</small>`;
                feelsLikeEl.innerHTML = `${feelsLikeF}°F / ${feelsLikeC}°C`;
                
                // Humidity
                currentHumidityEl.innerHTML = response.data.main.humidity + "%";
                
                // Wind speed and direction
                const windSpeedMs = response.data.wind.speed;
                const windSpeedMph = (windSpeedMs * 2.237).toFixed(2);
                currentWindEl.innerHTML = `${windSpeedMph} MPH (${windSpeedMs} m/s)`;
                
                const windDeg = response.data.wind.deg || 0;
                windDirectionEl.innerHTML = `${getWindDirection(windDeg)} (${windDeg}°)`;
                
                // Visibility (meters to km)
                const visibilityM = response.data.visibility || 10000;
                const visibilityKm = (visibilityM / 1000).toFixed(1);
                visibilityEl.innerHTML = `${visibilityKm} km (${visibilityM} m)`;
                
                // Pressure
                pressureEl.innerHTML = `${response.data.main.pressure} hPa`;
                
                // Cloudiness
                const clouds = response.data.clouds?.all || 0;
                cloudinessEl.innerHTML = `${clouds}%`;
                
                // Sunrise/Sunset
                sunriseEl.innerHTML = formatTime(response.data.sys.sunrise);
                sunsetEl.innerHTML = formatTime(response.data.sys.sunset);
                
                // Calculate dew point (using formula)
                const tempCForDew = k2c(response.data.main.temp);
                const humidityForDew = response.data.main.humidity;
                const dewPointC = tempCForDew - ((100 - humidityForDew) / 5);
                const dewPointF = Math.floor((dewPointC * 9/5) + 32);
                dewPointEl.innerHTML = `${dewPointC}°C / ${dewPointF}°F`;

                // UV Index (from One Call API - more accurate)
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                
                // Using One Call API for UV and additional data (deprecated but still works)
                let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIKey}&units=imperial`;
                
                axios.get(oneCallURL).then(function(oneCallResponse) {
                    const uvValue = oneCallResponse.data.current.uvi;
                    const UVIndex = document.createElement("span");
                    UVIndex.setAttribute("class", "badge");
                    
                    if (uvValue < 4) {
                        UVIndex.classList.add("badge-success");
                    } else if (uvValue < 8) {
                        UVIndex.classList.add("badge-warning");
                    } else {
                        UVIndex.classList.add("badge-danger");
                    }
                    
                    UVIndex.innerHTML = uvValue;
                    currentUVEl.innerHTML = "";
                    currentUVEl.appendChild(UVIndex);
                }).catch(function() {
                    // Fallback if One Call API fails
                    currentUVEl.innerHTML = "N/A";
                });

                // 5-day forecast using /forecast endpoint
                let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${APIKey}&units=imperial`;
                
                axios.get(forecastQueryURL).then(function(forecastResponse) {
                    fivedayEl.classList.remove("hidden");
                    
                    const forecastContainer = document.getElementById("forecast-container");
                    const forecastDivs = forecastContainer.querySelectorAll(".forecast");
                    
                    // Group forecasts by day (every 8 entries = 1 day)
                    let dailyForecasts = [];
                    const list = forecastResponse.data.list;
                    
                    for (let i = 0; i < list.length; i += 8) {
                        if (dailyForecasts.length < 5 && list[i]) {
                            dailyForecasts.push(list[i]);
                        }
                    }
                    
                    // Update each forecast card
                    for (let i = 0; i < forecastDivs.length && i < dailyForecasts.length; i++) {
                        const forecast = dailyForecasts[i];
                        const forecastDiv = forecastDivs[i];
                        forecastDiv.innerHTML = "";
                        
                        const forecastDate = new Date(forecast.dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();
                        
                        // Date element
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "forecast-date");
                        forecastDateEl.innerHTML = `${forecastMonth}/${forecastDay}/${forecastYear}`;
                        forecastDiv.appendChild(forecastDateEl);
                        
                        // Icon element
                        const forecastIcon = forecast.weather[0]?.icon;
                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute("src", getWeatherIconUrl(forecastIcon));
                        forecastWeatherEl.setAttribute("alt", forecast.weather[0]?.description || "Forecast icon");
                        forecastDiv.appendChild(forecastWeatherEl);
                        
                        // Description
                        const forecastDescEl = document.createElement("p");
                        forecastDescEl.innerHTML = forecast.weather[0]?.description || "";
                        forecastDescEl.style.fontSize = "0.8rem";
                        forecastDescEl.style.textTransform = "capitalize";
                        forecastDiv.appendChild(forecastDescEl);
                        
                        // Temperature
                        const forecastTempEl = document.createElement("p");
                        const tempF = Math.floor(forecast.main.temp);
                        const tempC = Math.floor((forecast.main.temp - 32) * 5/9);
                        forecastTempEl.innerHTML = `🌡️ ${tempF}°F / ${tempC}°C`;
                        forecastDiv.appendChild(forecastTempEl);
                        
                        // Feels like
                        const forecastFeelsLike = document.createElement("p");
                        const feelsLike = Math.floor(forecast.main.feels_like);
                        forecastFeelsLike.innerHTML = `Feels: ${feelsLike}°F`;
                        forecastFeelsLike.style.fontSize = "0.8rem";
                        forecastDiv.appendChild(forecastFeelsLike);
                        
                        // Humidity
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = `💧 ${forecast.main.humidity}%`;
                        forecastDiv.appendChild(forecastHumidityEl);
                        
                        // Wind
                        const forecastWindEl = document.createElement("p");
                        const windSpeed = (forecast.wind.speed * 2.237).toFixed(1);
                        forecastWindEl.innerHTML = `💨 ${windSpeed} MPH`;
                        forecastWindEl.style.fontSize = "0.8rem";
                        forecastDiv.appendChild(forecastWindEl);
                    }
                }).catch(function(forecastError) {
                    console.error("Forecast error:", forecastError);
                    // Don't show error for forecast if current weather works
                });
            })
            .catch(function(error) {
                hideLoading();
                console.error("API Error:", error);
                if (error.response && error.response.status === 404) {
                    showError(`City "${cityName}" not found. Please check the spelling and try again.`);
                } else if (error.response && error.response.status === 401) {
                    showError("API Key is invalid. Please check your API key.");
                } else {
                    showError("Unable to fetch weather data. Please check your internet connection and try again.");
                }
            });
    }

    // Search button event
    searchEl.addEventListener("click", function () {
        const searchTerm = cityEl.value.trim();
        if (!searchTerm) {
            showError("Please enter a city name");
            return;
        }
        
        getWeather(searchTerm);
        
        // Add to history if not already present
        if (!searchHistory.includes(searchTerm)) {
            searchHistory.unshift(searchTerm);
            // Keep only last 10 searches
            if (searchHistory.length > 10) searchHistory.pop();
            localStorage.setItem("search", JSON.stringify(searchHistory));
        }
        renderSearchHistory();
    });

    // Enter key support
    cityEl.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchEl.click();
        }
    });

    // Clear history
    clearEl.addEventListener("click", function () {
        localStorage.removeItem("search");
        searchHistory = [];
        renderSearchHistory();
        cityEl.value = "";
    });

    // Render search history
    function renderSearchHistory() {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const historyItem = document.createElement("button");
            historyItem.setAttribute("type", "button");
            historyItem.setAttribute("class", "history-item");
            historyItem.innerHTML = `<i class="fas fa-history"></i> ${searchHistory[i]}`;
            historyItem.style.cssText = `
                width: 100%;
                padding: 10px;
                margin: 5px 0;
                background: #f7fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                text-align: left;
                transition: all 0.3s;
            `;
            historyItem.addEventListener("click", function () {
                cityEl.value = searchHistory[i];
                getWeather(searchHistory[i]);
            });
            historyEl.appendChild(historyItem);
        }
    }

    // Initialize
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[0]);
    }
}

// Start the app
initPage();