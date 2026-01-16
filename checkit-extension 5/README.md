# CheckIt

**Investigate political claims instantly — right from your browser.**

CheckIt is a Chrome extension that helps you investigate claims you encounter online. Highlight any claim, right-click, and get:

- 📍 **Origin & Context** — Where did this claim come from?
- 📊 **Key Facts** — What does the data actually say?
- 🔄 **Coverage Spectrum** — How do left, center, and right-leaning outlets cover this?
- ⚠️ **Context Flags** — Missing context, outdated data, cherry-picked stats
- 🔗 **Sources** — Links to verify for yourself

## Why CheckIt?

CheckIt doesn't tell you what to believe. It gives you the information to decide for yourself.

Most fact-checkers give you a verdict. CheckIt gives you evidence.

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/checkit-extension.git
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked**

5. Select the `checkit-extension` folder

6. Click the CheckIt icon and add your Anthropic API key

### Getting an API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new key
5. Copy it into CheckIt's settings

## Usage

1. **Highlight** any claim on a webpage
2. **Right-click** and select "CheckIt: Investigate Claim"
3. **Review** the findings in the popup

You can also use the keyboard shortcut: `Ctrl+Shift+C` (Windows/Linux) or `Cmd+Shift+C` (Mac)

## Privacy

- Your API key is stored locally in your browser
- Claims are sent directly to Anthropic's API
- No data is collected or stored by CheckIt
- No analytics, no tracking

## How It Works

CheckIt uses Claude (by Anthropic) to:

1. Parse the claim you've highlighted
2. Research the origin and context
3. Gather relevant facts and data
4. Analyze how different media outlets cover the topic
5. Flag any potential issues (missing context, outdated info, etc.)
6. Compile sources for verification

## Limitations

- Results depend on Claude's training data and knowledge cutoff
- Not a replacement for professional fact-checking
- API calls cost money (roughly $0.01-0.03 per investigation)
- Complex claims may take 10-15 seconds to process

## Contributing

Pull requests welcome! Areas for improvement:

- [ ] Add real-time web search for more current information
- [ ] Support more languages
- [ ] Add browser history of past investigations
- [ ] Create Firefox version

## License

MIT License — use freely, attribution appreciated.

## Author

Built by [YOUR NAME] as a tool for civic engagement and media literacy.

---

*CheckIt helps you investigate — it doesn't tell you what to believe.*
