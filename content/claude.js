chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyMode') {
    try {
      const modePrompt = request.prompt;
      const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
      let injected = false;

      for (let textarea of textareas) {
        if (textarea.offsetParent !== null) {
          const fullPrompt = `${modePrompt}\n\n---\n\nPlease keep this behavior mode active for our conversation.`;

          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = fullPrompt;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
          } else {
            textarea.innerText = fullPrompt;
            textarea.textContent = fullPrompt;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          }

          injected = true;
          break;
        }
      }

      if (injected) {
        sendResponse({ success: true, message: 'Mode injected into input' });
      } else {
        throw new Error('Could not find input field');
      }
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  } else if (request.action === 'extract') {
    try {
      const messages = [];
      
      // Claude-specific selectors
      const messageElements = document.querySelectorAll('[data-testid*="message"], [class*="message"]');
      
      messageElements.forEach((el) => {
        const text = el.innerText?.trim();
        if (text && text.length > 0 && !text.includes('Claude')) {
          messages.push(text);
        }
      });
      
      if (messages.length === 0) {
        sendResponse({
          success: false,
          error: 'No messages found. Make sure the conversation is loaded.'
        });
        return;
      }
      
      const content = `# Conversation from Claude\n\n${messages.join('\n\n---\n\n')}\n\n---\n\n*Extracted on ${new Date().toLocaleString()}*`;
      
      sendResponse({
        success: true,
        content: content,
        provider: 'Claude'
      });
    } catch (err) {
      sendResponse({
        success: false,
        error: err.message
      });
    }
  }
});
