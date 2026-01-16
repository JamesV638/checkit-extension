// CheckIt Content Script - Floating Panel

let panel = null;
let currentClaim = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPanel') {
    currentClaim = message.claim;
    showPanel(message.claim);
  }
});

function showPanel(claim) {
  // Remove existing panel if any
  if (panel) {
    panel.remove();
  }
  
  // Create panel container
  panel = document.createElement('div');
  panel.id = 'checkit-panel';
  panel.innerHTML = `
    <div class="checkit-header">
      <div class="checkit-logo">
        <span class="checkit-logo-icon">✓</span>
        <span class="checkit-logo-text">CheckIt</span>
      </div>
      <button class="checkit-close" id="checkit-close">×</button>
    </div>
    <div class="checkit-content" id="checkit-content">
      <div class="checkit-loading">
        <div class="checkit-spinner"></div>
        <p>Investigating claim...</p>
        <p class="checkit-loading-sub">Searching sources</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Close button handler
  document.getElementById('checkit-close').addEventListener('click', () => {
    panel.remove();
    panel = null;
  });
  
  // Start the investigation
  investigateClaim(claim);
}

async function investigateClaim(claim) {
  const content = document.getElementById('checkit-content');
  
  // Get API key
  const { apiKey } = await chrome.runtime.sendMessage({ action: 'getApiKey' });
  
  if (!apiKey) {
    content.innerHTML = `
      <div class="checkit-error">
        <p>🔑 API Key Required</p>
        <p>Click the CheckIt icon in your toolbar to add your Anthropic API key.</p>
      </div>
    `;
    return;
  }
  
  // Update loading text
  const loadingTexts = ['Searching sources...', 'Cross-referencing...', 'Analyzing credibility...', 'Compiling results...'];
  let textIndex = 0;
  const loadingInterval = setInterval(() => {
    const sub = content.querySelector('.checkit-loading-sub');
    if (sub) {
      sub.textContent = loadingTexts[textIndex % loadingTexts.length];
      textIndex++;
    }
  }, 2500);
  
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'checkClaim',
      claim: claim,
      apiKey: apiKey
    });
    
    clearInterval(loadingInterval);
    
    if (response.success) {
      displayResults(response.data);
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    clearInterval(loadingInterval);
    content.innerHTML = `
      <div class="checkit-error">
        <p>⚠ ${error.message}</p>
        <button id="checkit-retry">Try Again</button>
      </div>
    `;
    document.getElementById('checkit-retry')?.addEventListener('click', () => {
      content.innerHTML = `
        <div class="checkit-loading">
          <div class="checkit-spinner"></div>
          <p>Investigating claim...</p>
          <p class="checkit-loading-sub">Searching sources</p>
        </div>
      `;
      investigateClaim(claim);
    });
  }
}

function displayResults(data) {
  const content = document.getElementById('checkit-content');
  
  const verdictConfig = {
    'TRUE': { icon: '✓', label: 'TRUE', class: 'verdict-true' },
    'MOSTLY_TRUE': { icon: '✓', label: 'MOSTLY TRUE', class: 'verdict-mostly-true' },
    'MIXED': { icon: '~', label: 'MIXED', class: 'verdict-mixed' },
    'MOSTLY_FALSE': { icon: '✗', label: 'MOSTLY FALSE', class: 'verdict-mostly-false' },
    'FALSE': { icon: '✗', label: 'FALSE', class: 'verdict-false' },
    'UNVERIFIED': { icon: '?', label: 'UNVERIFIED', class: 'verdict-unverified' }
  };
  
  const verdict = verdictConfig[data.verdict] || verdictConfig['UNVERIFIED'];
  
  const getLeanClass = (lean) => {
    if (lean === 'left' || lean === 'center-left') return 'lean-left';
    if (lean === 'right' || lean === 'center-right') return 'lean-right';
    return 'lean-center';
  };
  
  const getLeanLabel = (lean) => {
    const labels = {
      'left': '← Left',
      'center-left': '← Center-Left',
      'center': '• Center',
      'center-right': 'Center-Right →',
      'right': 'Right →'
    };
    return labels[lean] || '• Unknown';
  };
  
  const getCredLabel = (cred) => {
    if (cred === 'high') return '⭐⭐⭐ High';
    if (cred === 'mixed') return '⭐⭐ Mixed';
    return '⭐ Low';
  };
  
  let html = `
    <div class="checkit-verdict ${verdict.class}">
      <span class="checkit-verdict-icon">${verdict.icon}</span>
      <span class="checkit-verdict-label">${verdict.label}</span>
    </div>
    <p class="checkit-explanation">${data.verdict_explanation}</p>
  `;
  
  // Original source
  if (data.original_source) {
    html += `
      <div class="checkit-section">
        <h4>Original Source</h4>
        <div class="checkit-source-item">
          <a href="${data.original_source.url}" target="_blank">${data.original_source.name}</a>
          <div class="checkit-badges">
            <span class="checkit-badge ${getLeanClass(data.original_source.lean)}">${getLeanLabel(data.original_source.lean)}</span>
            <span class="checkit-badge checkit-cred">${getCredLabel(data.original_source.credibility)}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // Verification sources
  if (data.verification_sources && data.verification_sources.length > 0) {
    html += `<div class="checkit-section"><h4>Verified By</h4>`;
    data.verification_sources.forEach(source => {
      const supportClass = source.supports_claim ? 'supports' : 'refutes';
      const supportIcon = source.supports_claim ? '✓' : '✗';
      html += `
        <div class="checkit-verify-item ${supportClass}">
          <div class="checkit-verify-header">
            <span class="checkit-verify-icon">${supportIcon}</span>
            <a href="${source.url}" target="_blank">${source.name}</a>
          </div>
          <p class="checkit-verify-finding">${source.key_finding}</p>
        </div>
      `;
    });
    html += `</div>`;
  }
  
  // Facts
  if (data.facts && data.facts.length > 0) {
    html += `<div class="checkit-section"><h4>Key Facts</h4><ul class="checkit-facts">`;
    data.facts.forEach(fact => {
      html += `<li>${fact}</li>`;
    });
    html += `</ul></div>`;
  }
  
  // Flags
  if (data.flags && data.flags.length > 0) {
    html += `<div class="checkit-section"><h4>Context Flags</h4><div class="checkit-flags">`;
    data.flags.forEach(flag => {
      html += `<span class="checkit-flag">⚠ ${flag}</span>`;
    });
    html += `</div></div>`;
  }
  
  // Partisan Coverage
  if (data.partisan_coverage) {
    html += `<div class="checkit-section"><h4>Partisan Coverage</h4>`;
    
    if (data.partisan_coverage.left && data.partisan_coverage.left.source) {
      html += `
        <div class="checkit-partisan-item left">
          <span class="checkit-partisan-label">← LEFT</span>
          <a href="${data.partisan_coverage.left.url}" target="_blank">${data.partisan_coverage.left.source}</a>
          <p>${data.partisan_coverage.left.summary}</p>
        </div>
      `;
    }
    
    if (data.partisan_coverage.right && data.partisan_coverage.right.source) {
      html += `
        <div class="checkit-partisan-item right">
          <span class="checkit-partisan-label">RIGHT →</span>
          <a href="${data.partisan_coverage.right.url}" target="_blank">${data.partisan_coverage.right.source}</a>
          <p>${data.partisan_coverage.right.summary}</p>
        </div>
      `;
    }
    
    html += `</div>`;
  }
  
  content.innerHTML = html;
}
