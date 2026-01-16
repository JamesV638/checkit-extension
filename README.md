# CheckIt — AI-Powered Fact-Checking Chrome Extension

CheckIt is a Chrome extension that lets you fact-check any claim on the web in seconds. Highlight text, right-click, and get an instant verdict backed by trusted sources.

## Features

- **Real-time fact-checking** — Analyze any claim directly in your browser
- **AI-powered verdicts** — Uses Claude's API to evaluate accuracy
- **Source transparency** — Cross-references non-partisan sources and shows partisan outlets separately for context
- **Clean UI** — Floating panel appears without disrupting your browsing

## How It Works

1. Highlight a suspicious claim on any webpage
2. Right-click and select "Check with CheckIt"
3. View the verdict with supporting sources

## Tech Stack

- JavaScript
- Chrome Extension APIs
- Anthropic Claude API
- HTML/CSS

## Demo

https://www.youtube.com/watch?v=V0N8Uxj1s38

## Installation

1. Clone this repository
2. Go to `chrome://extensions/` in Chrome
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the project folder

**Note:** This extension requires a Claude API key to function. To protect my API key, it is not included in this repository. Watch the demo video to see CheckIt in action.

To run CheckIt yourself:
1. Get a Claude API key from [console.anthropic.com](https://console.anthropic.com)
2. Add your key to the extension settings
3. Load the extension in Chrome

## Built By

James VandeHei
