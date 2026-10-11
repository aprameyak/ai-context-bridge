chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyMode') {
    try {
      const textareas = document.querySelectorAll('textarea, [contenteditable="true"]');
      let injected = false;

      for (let textarea of textareas) {
        if (textarea.offsetParent !== null && textarea.innerText?.length < 100) {
          const fullPrompt = `${request.prompt}\n\n---\n\nPlease keep this behavior mode active.`;

          if (textarea.tagName === 'TEXTAREA') {
            textarea.value = fullPrompt;
          } else {
            textarea.innerText = fullPrompt;
            textarea.textContent = fullPrompt;
          }
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          injected = true;
          break;
        }
      }

      sendResponse({ success: injected, message: injected ? 'Mode injected' : 'Could not find input' });
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  } else if (request.action === 'extract') {
    try {
      const messages = [];
      const messageElements = document.querySelectorAll('[role="article"], [class*="message"]');
      
      messageElements.forEach((el) => {
        const text = el.innerText?.trim();
        if (text && text.length > 0) {
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
      
      const content = `# Conversation from Perplexity\n\n${messages.join('\n\n---\n\n')}\n\n---\n\n*Extracted on ${new Date().toLocaleString()}*`;
      
      sendResponse({
        success: true,
        content: content,
        provider: 'Perplexity'
      });
    } catch (err) {
      sendResponse({
        success: false,
        error: err.message
      });
    }
  }
});
