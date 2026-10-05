chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract') {
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
