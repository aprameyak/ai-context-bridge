# AI Context Bridge

A Chrome extension that seamlessly transfers conversations between AI chat providers (ChatGPT, Claude, Gemini, and more).

## Features

- **One-click extraction** of conversations from any supported AI chat
- **Clean Markdown formatting** for easy reading and sharing
- **Automatic clipboard copy** for quick pasting to other providers
- **Support for multiple providers**: ChatGPT, Claude, Gemini, Perplexity, DeepSeek
- **No data stored** — everything stays local and private

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select this folder
5. The extension icon appears in your toolbar

## Usage

1. Open any supported AI chat (ChatGPT, Claude, Gemini)
2. Click the "AI Context Bridge" extension icon
3. Click "Extract Conversation"
4. The conversation is copied to your clipboard
5. Switch to another AI provider
6. Paste the context and continue the conversation

## Supported Providers

- ChatGPT (chat.openai.com, chatgpt.com)
- Claude (claude.ai)
- Google Gemini (gemini.google.com)
- Perplexity AI
- DeepSeek

## Privacy

All extraction happens locally in your browser. No data is sent to external servers. The extension only reads visible text from the webpage you're on.

## How It Works

The extension uses content scripts to:
1. Detect the current AI provider
2. Find conversation messages in the DOM
3. Format them as Markdown
4. Copy to clipboard

## Limitations

- Only extracts visible messages (conversation must be fully loaded)
- Formatting depends on how each provider structures their DOM
- Works best with recent conversations

## Future Improvements

- [ ] Storage of conversation history
- [ ] Custom formatting options
- [ ] Automatic provider detection and switching
- [ ] Sync across devices
- [ ] Support for more providers

## License

MIT

## Contributing

Found an issue or have a suggestion? Please open an issue on GitHub.
