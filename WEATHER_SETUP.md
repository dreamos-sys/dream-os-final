# 🌤️ Weather Widget Setup Guide

## Get Your FREE OpenWeatherMap API Key (2 minutes!)

### Step 1: Sign Up
1. Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **"Sign Up"** (top right)
3. Create a free account (no credit card needed)

### Step 2: Get API Key
1. After signing in, go to [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
2. Copy your **default API key** (looks like: `a1b2c3d4e5f6...`)

### Step 3: Add to WeatherWidget
1. Open `src/lib/components/WeatherWidget.svelte`
2. Find line 12: `const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace with your key:
   ```javascript
   const WEATHER_API_KEY = 'a1b2c3d4e5f6g7h8i9j0...'; // Your actual key here
   ```

### Step 4: Done! 🎉
- The widget will now show **REAL weather** for your location
- Auto-detects your location via browser geolocation
- Falls back to Jakarta if location access is denied

---

## Features

### ✅ What's Working RIGHT NOW (even without API key):
- **Demo Mode**: Shows Jakarta weather (31°C, Clear Sky)
- **Llama AI Advice**: Connects to your local Llama server for personalized recommendations
- **Beautiful UI**: Weather icons, color-coded conditions, smooth animations
- **Auto-refresh**: Updates every 10 minutes automatically
- **Manual refresh**: Click the refresh button anytime

### ✅ What Works WITH API Key:
- **Real-time weather** for your exact location
- **Accurate data**: Temperature, humidity, wind speed
- **Live conditions**: Clear, clouds, rain, thunder, snow, etc.
- **Dynamic colors**: UI adapts to weather conditions
- **Location name**: Shows your city name

### ✅ Llama Integration:
- Tries to connect to `http://localhost:8080` (your local Llama server)
- Generates personalized weather advice in Indonesian
- Falls back to smart templates if Llama is not running
- Examples:
  - "Master, hari ini panas, jangan lupa minum es kelapa! 🥥"
  - "Ujan Master, jangan lupa payung! ☂️"
  - "Cuaca nyaman nih Master, enak buat outdoor! 😎"

---

## Weather Conditions & Icons

| Condition | Icon | Color |
|-----------|------|-------|
| Clear Sky | ☀️ | 🟠 Orange |
| Clouds | ☁️ | ⚪ Gray |
| Rain | 🌧️ | 🔵 Blue |
| Thunderstorm | ⛈️ | 🟣 Purple |
| Snow | ❄️ | ⚪ Light Blue |
| Mist/Fog | 🌫️ | ⚪ Silver |

---

## Troubleshooting

### Widget shows "Demo Mode"
- This is normal if you haven't set the API key yet
- Still shows weather data (Jakarta default)
- Get a free API key to see real weather

### Location shows as "Jakarta"
- Browser asked for location permission and you denied it
- Or geolocation failed
- Click "Allow" when browser asks for location access

### Llama advice not showing
- Make sure your Llama server is running: `llama-server -m models/small_brain.gguf -c 512 -p 8080`
- Widget will fallback to smart templates if Llama is offline
- No errors will occur - it's designed to work either way

### Weather not updating
- Click the refresh button (🔄 icon)
- Wait 10 minutes for auto-refresh
- Check browser console for errors (F12)

---

## API Rate Limits (Free Tier)
- **60 calls/minute** - More than enough!
- Widget auto-refreshes every 10 minutes (6 calls/hour)
- You won't hit the limit unless you refresh manually like crazy

---

## Pro Tips

1. **Test with Llama running**: Get the full AI experience with personalized advice
2. **Allow location access**: Browser will ask, click "Allow" for accurate weather
3. **Customize advice**: Edit `generateFallbackAdvice()` in WeatherWidget.svelte to add your own messages
4. **Change refresh rate**: Edit the `setInterval` value (default: 10 minutes)

---

## Example Llama Server Command

```bash
llama-server -m models/small_brain.gguf -c 512 -p 8080 --host localhost
```

This starts your local Llama server on port 8080, which the weather widget uses for AI recommendations!
