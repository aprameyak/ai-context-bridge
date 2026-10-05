document.addEventListener('DOMContentLoaded', async () => {
  const providerEl = document.getElementById('provider');
  const extractBtn = document.getElementById('extractBtn');
  const previewEl = document.getElementById('preview');
  
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url) {
      providerEl.textContent = 'Error: No tab';
      providerEl.classList.add('error');
      return;
    }
    
    const url = tab.url;
    
    // Detect provider
    let provider = 'Unknown';
    if (url.includes('chat.openai.com') || url.includes('chatgpt.com')) {
      provider = 'ChatGPT';
    } else if (url.includes('claude.ai')) {
      provider = 'Claude';
    } else if (url.includes('gemini.google.com')) {
      provider = 'Gemini';
    } else if (url.includes('perplexity.ai')) {
      provider = 'Perplexity';
    } else if (url.includes('deepseek.com')) {
      provider = 'DeepSeek';
    }
    
    providerEl.textContent = provider;
    providerEl.classList.add('detected');
    
    if (provider !== 'Unknown') {
      extractBtn.disabled = false;
    }
    
    // Extract button handler
    extractBtn.addEventListener('click', async () => {
      extractBtn.disabled = true;
      extractBtn.textContent = 'Extracting...';
      
      try {
        const result = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });
        
        if (result.success) {
          // Copy to clipboard
          await navigator.clipboard.writeText(result.content);
          
          // Show preview
          const lines = result.content.split('\n').slice(0, 5).join('\n');
          previewEl.innerHTML = `<p><strong>✓ Copied to clipboard!</strong></p><p>${lines}...</p>`;
          previewEl.style.display = 'block';
          
          extractBtn.textContent = 'Copied! ✓';
          setTimeout(() => {
            extractBtn.textContent = 'Extract Conversation';
            extractBtn.disabled = false;
          }, 2000);
        } else {
          throw new Error(result.error || 'Failed to extract');
        }
      } catch (err) {
        providerEl.textContent = 'Error: ' + err.message;
        providerEl.classList.remove('detected');
        providerEl.classList.add('error');
        extractBtn.disabled = false;
        extractBtn.textContent = 'Extract Conversation';
      }
    });
  } catch (err) {
    providerEl.textContent = 'Error loading';
    providerEl.classList.add('error');
  }
});
