# 🌤️ Weather Dashboard

A clean, responsive weather dashboard web app that lets you search any city in the world and instantly view current conditions plus a 5-day forecast — all powered by the OpenWeatherMap API.

---

## 📸 Preview

> Search a city → get live temperature, humidity, wind speed, UV index, and a 5-day outlook.

---

## ✨ Features

- 🔍 **City Search** — look up current weather for any city worldwide
- 🌡️ **Current Conditions** — temperature (°F), humidity, wind speed, and UV index
- 🟢🟡🔴 **UV Index Badge** — color-coded indicator (green / yellow / red) based on severity
- 📅 **5-Day Forecast** — daily weather icon, temperature, and humidity
- 🕘 **Search History** — recent searches saved to `localStorage` and clickable for quick re-lookup
- 🗑️ **Clear History** — one-click wipe of all saved searches
- ⌨️ **Enter Key Support** — press Enter to search, no need to click the button
- 📱 **Responsive Layout** — adapts cleanly to mobile, tablet, and desktop screens

---

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 (custom) | Styling — no frameworks, hand-rolled layout |
| JavaScript (ES6) | App logic and DOM manipulation |
| [Axios](https://axios-http.com/) | HTTP requests |
| [OpenWeatherMap API](https://openweathermap.org/api) | Weather data |
| [Font Awesome 5](https://fontawesome.com/) | Search icon |
| [Google Fonts](https://fonts.google.com/) | Bebas Neue + DM Sans |

---

## 🚀 Getting Started

### Prerequisites

- A free [OpenWeatherMap API key](https://openweathermap.org/appid)
- A modern web browser
- No build tools or installs required

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Add your API key**

   Open `script.js` and replace the placeholder with your own key:
   ```js
   const APIKey = "YOUR_API_KEY_HERE";
   ```

3. **Open in browser**

   Simply open `index.html` in your browser — no server needed.
   ```bash
   open index.html
   # or just double-click the file
   ```

---

## 📁 File Structure

```
weather-dashboard/
│
├── index.html      # App markup and layout
├── style.css       # All custom styles (no Bootstrap)
└── script.js       # Weather logic, API calls, history handling
```

---

## 🔌 API Endpoints Used

| Endpoint | Data |
|---|---|
| `/data/2.5/weather` | Current weather by city name |
| `/data/2.5/uvi/forecast` | UV index by lat/lon |
| `/data/2.5/forecast` | 5-day / 3-hour forecast by city ID |

---

## ⚠️ Known Limitations

- Temperature is displayed in **Fahrenheit only**
- The UV Index endpoint (`/uvi/forecast`) is part of OpenWeatherMap's legacy API — it may require a paid plan depending on your account tier
- Search history is stored in **localStorage** and is browser/device specific

---

## 📄 License

Distributed under the MIT License. Feel free to use, modify, and share.

---

## 💬 A Note to Fellow Beginners

If you found this project and you're just starting out — **welcome, and keep going.**

Every developer you admire once stared at a broken API call, refreshed the browser a hundred times, and Googled "why is my variable undefined" at 2am. That's not a sign you're bad at this. That's just what learning looks like.

This project started simple: a search box, some fetch calls, and a lot of trial and error. The fact that you're here reading this, exploring how it works, means you're already doing the thing.

**A few things worth knowing early on:**

- You don't need to understand everything before you build something. Build it confused. Understanding comes after.
- Reading other people's code is one of the fastest ways to grow. Clone repos, break them, fix them.
- Your version doesn't have to be better. It just has to be *yours*.

Fork this, remix it, add dark mode, add a toggle for Celsius, add a favourite cities list — whatever makes you curious. Every feature you add is a real thing you built, and nobody can take that from you.

**You've got this. Ship the thing.** 🚀