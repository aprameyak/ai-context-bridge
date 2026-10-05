chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
    try {
      const messages = [];
      const messageElements = document.querySelectorAll('[class*="message"], [data-message]');
      
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
      
      const content = `# Conversation from DeepSeek\n\n${messages.join('\n\n---\n\n')}\n\n---\n\n*Extracted on ${new Date().toLocaleString()}*`;
      
      sendResponse({
        success: true,
        content: content,
        provider: 'DeepSeek'
      });
    } catch (err) {
      sendResponse({
        success: false,
        error: err.message
      });
    }
  }
});
