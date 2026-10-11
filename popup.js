const BEHAVIOR_MODES = {
  normal: '',
  terse: 'Answer concisely. No disclaimers, no unnecessary context, no five-paragraph preambles. Get straight to the point. Only explain what\'s directly relevant to the question. Assume the user is competent and doesn\'t need hand-holding.',
  honest: 'Be honest about uncertainty. If you don\'t know something, say "I don\'t know" instead of confidently inventing answers. Be clear about confidence levels. Don\'t pretend to certainty you don\'t have.',
  direct: 'Answer the question asked. Don\'t turn simple questions into coaching sessions or add unsolicited advice. No fake empathy ("I understand how you feel"). No "I hear you" or platitudes. Just the answer.',
  noflat: 'Stop excessive praise and agreement. Don\'t validate every question as brilliant. Don\'t say things are "great ideas" when they\'re not. Be straightforward. Challenge weak thinking.',
  challenge: 'Find flaws in the user\'s logic. Question assumptions. Point out risks and inconsistencies. Don\'t agree just to be nice - actually critique the thinking.',
  risks: 'Lead with risks. What could go wrong? Start by highlighting failures, downsides, and negative outcomes. Only after covering risks, discuss opportunities.',
  assume: 'Make reasonable assumptions instead of asking for endless clarification. The user can correct you if you\'re wrong. Don\'t interrupt their workflow with unnecessary questions.'
};

document.addEventListener('DOMContentLoaded', async () => {
  const providerEl = document.getElementById('provider');
  const extractBtn = document.getElementById('extractBtn');
  const previewEl = document.getElementById('preview');
  const modeSelect = document.getElementById('modeSelect');
  
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
      document.getElementById('applyModeBtn').disabled = false;
    }

    const getSelectedMode = () => {
      const mode = modeSelect.value;
      return mode !== 'normal' ? BEHAVIOR_MODES[mode] : '';
    };

    // Extract button handler
    extractBtn.addEventListener('click', async () => {
      extractBtn.disabled = true;
      extractBtn.textContent = 'Extracting...';

      try {
        const result = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });

        if (result.success) {
          let content = result.content;
          const modePrompt = getSelectedMode();

          if (modePrompt) {
            content = `[BEHAVIOR MODE: ${modeSelect.options[modeSelect.selectedIndex].text}]\n\n${modePrompt}\n\n---\n\n${content}`;
          }

          await navigator.clipboard.writeText(content);

          const lines = content.split('\n').slice(0, 4).join('\n');
          previewEl.innerHTML = `<p><strong>✓ Copied with mode "${modeSelect.options[modeSelect.selectedIndex].text}"</strong></p><p><small>${lines}...</small></p>`;
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

    // Apply mode button handler
    document.getElementById('applyModeBtn').addEventListener('click', async () => {
      const applyModeBtn = document.getElementById('applyModeBtn');
      applyModeBtn.disabled = true;
      applyModeBtn.textContent = 'Applying...';

      try {
        const modePrompt = getSelectedMode();
        if (!modePrompt) {
          throw new Error('Select a mode other than Normal');
        }

        await chrome.tabs.sendMessage(tab.id, {
          action: 'applyMode',
          mode: modeSelect.value,
          prompt: modePrompt
        });

        previewEl.innerHTML = `<p><strong>✓ Mode applied!</strong> ${modeSelect.options[modeSelect.selectedIndex].text}</p>`;
        previewEl.style.display = 'block';

        applyModeBtn.textContent = 'Mode Applied! ✓';
        setTimeout(() => {
          applyModeBtn.textContent = 'Apply Mode to This Chat';
          applyModeBtn.disabled = false;
        }, 2000);
      } catch (err) {
        previewEl.innerHTML = `<p style="color: #ef4444;"><strong>Error:</strong> ${err.message}</p>`;
        previewEl.style.display = 'block';
        applyModeBtn.textContent = 'Apply Mode to This Chat';
        applyModeBtn.disabled = false;
      }
    });
  } catch (err) {
    providerEl.textContent = 'Error loading';
    providerEl.classList.add('error');
  }
});
