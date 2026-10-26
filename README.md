# AI Context Bridge

A Chrome extension that copies the visible conversation from an AI chat page (ChatGPT, Claude, Gemini, Perplexity, DeepSeek) to your clipboard as Markdown, so you can paste it into a different provider and continue there.

Clicking "Extract Conversation" on a ChatGPT tab copies text in this shape:

```markdown
# Conversation from ChatGPT

<first message>

---

<second message>

---

*Extracted on 10/26/2026, 3:14:07 PM*
```

## Features

- Detects the provider from the active tab's URL and enables the popup buttons only on supported sites.
- Extracts message text from the page DOM and copies it to the clipboard as Markdown, with a short preview in the popup.
- Optional behavior modes (Terse, Honest, Direct, Stop Flattery, Challenge Me, Risk-First, Make Assumptions). The selected mode's instruction text is prepended to the copied conversation, or "Apply Mode to This Chat" writes it into the current page's input box.
- No network requests and no server: extraction and copying happen in the browser.

## Getting started

The repo does not include the icon PNGs that `manifest.json` references, and Chrome will refuse to load the extension without them. Generate them first with ImageMagick:

```bash
git clone https://github.com/aprameyak/ai-context-bridge.git
cd ai-context-bridge
bash icons/create_icons.sh
```

Then load it:

1. Open `chrome://extensions/` and turn on Developer mode.
2. Click "Load unpacked" and select the repo folder.
3. Open a supported chat, click the extension icon, and click "Extract Conversation".

There is no build step, package manager, or test suite.

## How it works

- `manifest.json` (Manifest V3) registers one content script per provider in `content/` and limits host permissions to those sites.
- `popup.html` and `popup.js` detect the provider, send an `extract` or `applyMode` message to the content script in the active tab, and write the result to the clipboard. The behavior mode prompts are defined in `popup.js`.
- Each `content/*.js` file finds messages with provider-specific selectors (for example `[data-message-id]` on ChatGPT) and falls back to broader class-name matches.
- `background.js` is a minimal service worker that only logs.

## Limitations

- Selectors are tied to each site's current markup and break when a provider changes its DOM. Only messages already rendered on the page are captured.
- The DeepSeek and Perplexity scripts match only `https://www.deepseek.com/*` and `https://www.perplexity.ai/*`. DeepSeek's chat app runs on `chat.deepseek.com`, so extraction there will not work until the manifest is updated.

## Contributing

Issues and pull requests are welcome. Test changes by reloading the unpacked extension on each provider you touched.

## License

MIT, see [LICENSE](LICENSE).
