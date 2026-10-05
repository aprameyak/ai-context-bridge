chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Context Bridge installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle any background tasks if needed
  if (request.action === 'log') {
    console.log('[AI Context Bridge]', request.message);
  }
});
