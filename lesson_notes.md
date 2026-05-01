# Weather Dashboard API Lesson Notes

## What is an API?
- API stands for Application Programming Interface.
- In this app, the API is the OpenWeatherMap service accessed by URLs.
- The API is the remote service that returns weather data in response to HTTP requests.

## What is the API token/key?
- The API token is a secret key used to authenticate requests.
- In this app, it is stored in `assets/js/script.js` as:
  - `const APIKey = "84b79da5e5d7c92085660485702f4ce8"`
- The API key tells OpenWeatherMap who is requesting data and tracks usage.
- This token is usually unique per developer account or app.

## Why use Axios?
- Axios is a JavaScript HTTP library used in this project.
- It is simple and returns promises.
- Example:
  ```js
  axios.get(queryURL)
    .then(function (response) {
      // handle response
    });
  ```
- Alternatives include `fetch()`, `XMLHttpRequest`, `jQuery.ajax`, `superagent`, `ky`, etc.
- `fetch()` is built into browsers, but requires extra steps like `response.json()`.

## How the API request is made
- The app calls the API using URLs and query parameters.
- Example current weather URL:
  ```js
  https://api.openweathermap.org/data/2.5/weather?q=CityName&appid=APIKey
  ```
- The request uses:
  - base URL: `https://api.openweathermap.org`
  - endpoint path: `/data/2.5/weather`
  - query parameters: `?q=...&appid=...`

## Main function: `getWeather(cityName)`
- This function builds the current weather request URL.
- It takes one parameter: `cityName`.
- It sends the request and then processes the response.
- The response is accessed through `response.data`.

## API call sequence in the app
1. Current weather request
   - Endpoint: `/data/2.5/weather`
   - Returns current conditions, coordinates, city ID, temperature, humidity, wind, weather icon.
2. UV index request
   - Endpoint: `/data/2.5/uvi/forecast`
   - Uses `lat`, `lon`, `appid`, and `cnt=1`.
   - Returns UV index value.
3. 5-day forecast request
   - Endpoint: `/data/2.5/forecast`
   - Uses `id` and `appid`.
   - Returns 3-hour interval forecast data.

## How query parameters work
- Start with `?` after the endpoint.
- Separate parameters with `&`.
- Use `=` to assign values.
- Example:
  - `?q=London&appid=APIKey`
  - `?lat=35&lon=139&appid=APIKey&cnt=1`

## How the app uses response data
- Current weather response updates:
  - city name and date
  - icon image
  - temperature (converted from Kelvin to Fahrenheit)
  - humidity and wind speed
- UV index response creates a colored badge.
- Forecast response fills 5 forecast cards using selected entries from the list.

## Notes on security and usage
- API keys should not be exposed in public client-side code in production.
- Each service usually issues unique tokens per developer or per app.
- You must get the key from the API provider’s developer dashboard.

## Useful general rule for API URLs
- Pattern:
  - `BASE_URL + ENDPOINT + ?param1=value1&param2=value2`
- Example:
  - `https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=APIKey`

## Local storage and search history
- The app saves search history in browser storage using `localStorage`.
- It stores history under the key `search`.
- Example:
  ```js
  localStorage.setItem("search", JSON.stringify(searchHistory));
  ```
- It reads history back with:
  ```js
  JSON.parse(localStorage.getItem("search")) || []
  ```
