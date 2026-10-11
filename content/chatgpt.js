chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyMode') {
    try {
      const modePrompt = request.prompt;
      const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
      let injected = false;

      for (let textarea of textareas) {
        if (textarea.offsetParent !== null && textarea.innerText?.length < 100) {
          const fullPrompt = `${modePrompt}\n\n---\n\nPlease keep this behavior mode active for our conversation.`;

          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = fullPrompt;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
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
        sendResponse({ success: true, message: 'Mode injected into ChatGPT' });
      } else {
        throw new Error('Could not find input field');
      }
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  } else if (request.action === 'extract') {
    try {
      const messages = [];
      
      // Try to find conversation messages in the DOM
      const messageElements = document.querySelectorAll('[data-message-id]');
      
      if (messageElements.length === 0) {
        // Fallback: look for message divs
        const textElements = document.querySelectorAll('div[class*="message"]');
        textElements.forEach((el, idx) => {
          const text = el.innerText?.trim();
          if (text && text.length > 0) {
            messages.push(text);
          }
        });
      } else {
        messageElements.forEach((el) => {
          const text = el.innerText?.trim();
          if (text && text.length > 0) {
            messages.push(text);
          }
        });
      }
      
      if (messages.length === 0) {
        sendResponse({
          success: false,
          error: 'No messages found. Make sure the conversation is loaded.'
        });
        return;
      }
      
      // Format as markdown
      const content = `# Conversation from ChatGPT\n\n${messages.join('\n\n---\n\n')}\n\n---\n\n*Extracted on ${new Date().toLocaleString()}*`;
      
      sendResponse({
        success: true,
        content: content,
        provider: 'ChatGPT'
      });
    } catch (err) {
      sendResponse({
        success: false,
        error: err.message
      });
    }
  }
});
