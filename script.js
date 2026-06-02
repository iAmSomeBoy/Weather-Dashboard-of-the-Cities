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
    const sunriseMetaEl = document.getElementById("sunrise-meta");
    const sunsetMetaEl = document.getElementById("sunset-meta");
    const currentDateEl = document.getElementById("current-date");
    const hourlyPreviewEl = document.getElementById("hourly-preview-body");
    const forecastTabsEl = document.getElementById("forecast-tabs");
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

    function formatDisplayDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString([], {
            weekday: "long",
            day: "numeric",
            month: "short"
        });
    }

    function setUvBadge(uvValue) {
        const uvBadge = document.createElement("span");
        uvBadge.setAttribute("class", "badge");
        const roundedUv = Number(uvValue).toFixed(1);

        if (uvValue < 3) {
            uvBadge.classList.add("badge-success");
        } else if (uvValue < 6) {
            uvBadge.classList.add("badge-warning");
        } else {
            uvBadge.classList.add("badge-danger");
        }

        uvBadge.innerHTML = roundedUv;
        currentUVEl.innerHTML = "";
        currentUVEl.appendChild(uvBadge);
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
                nameEl.textContent = response.data.name;
                currentDateEl.textContent = formatDisplayDate(response.data.dt);

                // Weather icon and description
                let weatherPic = response.data.weather[0]?.icon;
                currentPicEl.setAttribute("src", getWeatherIconUrl(weatherPic));
                currentPicEl.setAttribute("alt", response.data.weather[0]?.description || "Weather icon");
                descriptionEl.innerHTML = response.data.weather[0]?.description || "No description";
                
                // Get current weather icon ID for potential custom mapping
                // Temperature data
                const tempF = k2f(response.data.main.temp);
                const tempC = k2c(response.data.main.temp);
                const feelsLikeC = k2c(response.data.main.feels_like);
                
                currentTempEl.innerHTML = `${tempC}°C <small>(${tempF}°F)</small><br><small>↓${k2c(response.data.main.temp_min)}° ↑${k2c(response.data.main.temp_max)}°</small>`;
                feelsLikeEl.innerHTML = `${feelsLikeC}°C`;
                
                // Humidity
                currentHumidityEl.innerHTML = response.data.main.humidity + "%";
                
                // Wind speed and direction
                const windSpeedMs = response.data.wind.speed;
                const windSpeedKmh = (windSpeedMs * 3.6).toFixed(1);
                currentWindEl.innerHTML = `${windSpeedKmh} km/h`;
                
                const windDeg = response.data.wind.deg || 0;
                windDirectionEl.innerHTML = `${getWindDirection(windDeg)} (${windDeg}°)`;
                
                // Visibility (meters to km)
                const visibilityM = response.data.visibility || 10000;
                const visibilityKm = (visibilityM / 1000).toFixed(1);
                visibilityEl.innerHTML = `${visibilityKm} km`;
                
                // Pressure
                pressureEl.innerHTML = `${response.data.main.pressure} hPa`;
                
                // Cloudiness
                const clouds = response.data.clouds?.all || 0;
                cloudinessEl.innerHTML = `${clouds}%`;
                
                // Sunrise/Sunset
                const sunriseText = formatTime(response.data.sys.sunrise);
                const sunsetText = formatTime(response.data.sys.sunset);
                sunriseEl.innerHTML = sunriseText;
                sunsetEl.innerHTML = sunsetText;
                if (sunriseMetaEl) sunriseMetaEl.innerHTML = sunriseText;
                if (sunsetMetaEl) sunsetMetaEl.innerHTML = sunsetText;
                
                // Calculate dew point (using formula)
                const tempCForDew = k2c(response.data.main.temp);
                const humidityForDew = response.data.main.humidity;
                const dewPointC = tempCForDew - ((100 - humidityForDew) / 5);
                dewPointEl.innerHTML = `${dewPointC}°C`;

                // UV Index (from One Call API - more accurate)
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lon;
                
                // Using One Call API for UV and additional arguments
                let oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${APIKey}&units=metric`;
                
                axios.get(oneCallURL).then(function(oneCallResponse) {
                    const current = oneCallResponse.data.current;

                    // API-backed enriched arguments
                    if (typeof current.uvi === "number") {
                        setUvBadge(current.uvi);
                    }
                    if (typeof current.dew_point === "number") {
                        dewPointEl.innerHTML = `${Math.round(current.dew_point)}°C`;
                    }
                    if (typeof current.feels_like === "number") {
                        feelsLikeEl.innerHTML = `${Math.round(current.feels_like)}°C`;
                    }
                    if (typeof current.clouds === "number") {
                        cloudinessEl.innerHTML = `${current.clouds}%`;
                    }
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

                    if (forecastTabsEl) {
                        forecastTabsEl.innerHTML = "";
                        const allTab = document.createElement("button");
                        allTab.className = "forecast-tab is-active";
                        allTab.type = "button";
                        allTab.textContent = "All Days";
                        forecastTabsEl.appendChild(allTab);

                        dailyForecasts.forEach((item) => {
                            const tab = document.createElement("button");
                            tab.className = "forecast-tab";
                            tab.type = "button";
                            tab.textContent = new Date(item.dt * 1000).toLocaleDateString([], {
                                day: "numeric",
                                month: "short",
                                weekday: "short"
                            });
                            forecastTabsEl.appendChild(tab);
                        });
                    }

                    // Fill compact hourly preview panel
                    if (hourlyPreviewEl) {
                        hourlyPreviewEl.innerHTML = "";
                        const hourlyItems = list.slice(0, 5);
                        hourlyItems.forEach((item) => {
                            const timeLabel = new Date(item.dt * 1000).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                            });
                            const row = document.createElement("div");
                            const tempC = ((item.main.temp - 32) * 5 / 9).toFixed(1);
                            row.className = "hourly-item";
                            row.innerHTML = `<span>${timeLabel}</span><span>${tempC}°C</span>`;
                            hourlyPreviewEl.appendChild(row);
                        });
                    }
                    
                    // Update each forecast card
                    for (let i = 0; i < forecastDivs.length && i < dailyForecasts.length; i++) {
                        const forecast = dailyForecasts[i];
                        const forecastDiv = forecastDivs[i];
                        forecastDiv.innerHTML = "";
                        
                        const forecastDate = new Date(forecast.dt * 1000);
                        const forecastDay = forecastDate.toLocaleDateString([], {
                            weekday: "short",
                            day: "numeric",
                            month: "short"
                        });
                        const forecastTime = forecastDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        });
                        
                        // Date element
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "forecast-date");
                        forecastDateEl.innerHTML = `${forecastDay}`;
                        forecastDiv.appendChild(forecastDateEl);

                        const forecastTimeEl = document.createElement("p");
                        forecastTimeEl.className = "forecast-time";
                        forecastTimeEl.innerHTML = forecastTime;
                        forecastDiv.appendChild(forecastTimeEl);
                        
                        // Icon element
                        const forecastIcon = forecast.weather[0]?.icon;
                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute("src", getWeatherIconUrl(forecastIcon));
                        forecastWeatherEl.setAttribute("alt", forecast.weather[0]?.description || "Forecast icon");
                        forecastDiv.appendChild(forecastWeatherEl);
                        
                        // Description
                        const forecastDescEl = document.createElement("p");
                        forecastDescEl.innerHTML = forecast.weather[0]?.description || "";
                        forecastDescEl.style.fontSize = "0.85rem";
                        forecastDescEl.style.textTransform = "capitalize";
                        forecastDiv.appendChild(forecastDescEl);
                        
                        // Temperature
                        const forecastTempEl = document.createElement("p");
                        const tempC = Math.floor((forecast.main.temp - 32) * 5/9);
                        forecastTempEl.innerHTML = `${tempC}°C`;
                        forecastDiv.appendChild(forecastTempEl);
                        
                        // Feels like
                        const forecastFeelsLike = document.createElement("p");
                        const feelsLikeC = Math.floor((forecast.main.feels_like - 32) * 5 / 9);
                        forecastFeelsLike.innerHTML = `Feels ${feelsLikeC}°C`;
                        forecastFeelsLike.style.fontSize = "0.8rem";
                        forecastDiv.appendChild(forecastFeelsLike);
                        
                        // Humidity
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = `Humidity ${forecast.main.humidity}%`;
                        forecastDiv.appendChild(forecastHumidityEl);
                        
                        // Wind
                        const forecastWindEl = document.createElement("p");
                        const windSpeed = (forecast.wind.speed * 3.6).toFixed(1);
                        forecastWindEl.innerHTML = `Wind ${windSpeed} km/h`;
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