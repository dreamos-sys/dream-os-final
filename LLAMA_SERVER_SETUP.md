# Local Llama Server Setup Guide

## Quick Start

To enable the 7-tap neural authentication feature, you need to run the llama.cpp server:

### Option 1: Using llama-server (Recommended)
```bash
llama-server -m models/small_brain.gguf -c 512 -p 8080
```

### Option 2: Using Python server (if available)
```bash
python -m llama_cpp.server --model models/small_brain.gguf --port 8080
```

## What This Does

- **Model**: `small_brain.gguf` (already in your `models/` folder)
- **Port**: `8080` (localhost only, secure)
- **Context**: `512` tokens (lightweight for mobile)

## How the 7-Tap Feature Works

1. Tap the Sultan logo 7 times within 2.5 seconds
2. The app sends a POST request to `http://localhost:8080/completion`
3. If the server responds successfully → **unlocks the app**
4. If the server is not running → **shows clear error message** with setup instructions

## Error Messages You'll See

- **"Cannot reach Llama server"**: Server is not running on port 8080
- **"Connection timeout"**: Server is running but not responding within 5 seconds
- **"Auth failed: [details]"**: Server responded with an error

## Testing Without Llama Server

The app will show you exactly what's wrong if the server isn't running - no more blank white screen!
You'll see a red error message with instructions on how to start the server.

## Troubleshooting

### Port already in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill
# Then restart llama-server
```

### Model not found
Make sure `models/small_brain.gguf` exists:
```bash
ls -lh models/small_brain.gguf
```

### Server starts but app can't connect
- Check if you're accessing via `http://localhost:5173` (Vite dev server)
- The app connects to `http://localhost:8080` (Llama server)
- Both need to be running simultaneously
