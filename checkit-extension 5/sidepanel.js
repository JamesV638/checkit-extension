// CheckIt Popup JavaScript

// Source credibility database
const SOURCE_DATABASE = {
  // High credibility - Center/Wire Services
  'apnews.com': { name: 'Associated Press', lean: 'center', credibility: 3 },
  'reuters.com': { name: 'Reuters', lean: 'center', credibility: 3 },
  'afp.com': { name: 'AFP', lean: 'center', credibility: 3 },
  'bbc.com': { name: 'BBC', lean: 'center', credibility: 3 },
  'bbc.co.uk': { name: 'BBC', lean: 'center', credibility: 3 },
  'npr.org': { name: 'NPR', lean: 'center-left', credibility: 3 },
  'pbs.org': { name: 'PBS', lean: 'center', credibility: 3 },
  'c-span.org': { name: 'C-SPAN', lean: 'center', credibility: 3 },
  
  // High credibility - Left-leaning
  'nytimes.com': { name: 'New York Times', lean: 'left', credibility: 3 },
  'washingtonpost.com': { name: 'Washington Post', lean: 'left', credibility: 3 },
  'theatlantic.com': { name: 'The Atlantic', lean: 'left', credibility: 3 },
  'newyorker.com': { name: 'The New Yorker', lean: 'left', credibility: 3 },
  'politico.com': { name: 'Politico', lean: 'center-left', credibility: 3 },
  
  // High credibility - Right-leaning
  'wsj.com': { name: 'Wall Street Journal', lean: 'center-right', credibility: 3 },
  'economist.com': { name: 'The Economist', lean: 'center-right', credibility: 3 },
  'nationalreview.com': { name: 'National Review', lean: 'right', credibility: 2 },
  
  // Medium credibility - Left-leaning
  'cnn.com': { name: 'CNN', lean: 'left', credibility: 2 },
  'msnbc.com': { name: 'MSNBC', lean: 'left', credibility: 2 },
  'theguardian.com': { name: 'The Guardian', lean: 'left', credibility: 2 },
  'vox.com': { name: 'Vox', lean: 'left', credibility: 2 },
  'slate.com': { name: 'Slate', lean: 'left', credibility: 2 },
  'huffpost.com': { name: 'HuffPost', lean: 'left', credibility: 2 },
  'motherjones.com': { name: 'Mother Jones', lean: 'left', credibility: 2 },
  'thedailybeast.com': { name: 'Daily Beast', lean: 'left', credibility: 2 },
  
  // Medium credibility - Center
  'thehill.com': { name: 'The Hill', lean: 'center', credibility: 2 },
  'axios.com': { name: 'Axios', lean: 'center', credibility: 2 },
  'usatoday.com': { name: 'USA Today', lean: 'center', credibility: 2 },
  'cbsnews.com': { name: 'CBS News', lean: 'center', credibility: 2 },
  'abcnews.go.com': { name: 'ABC News', lean: 'center', credibility: 2 },
  'nbcnews.com': { name: 'NBC News', lean: 'center-left', credibility: 2 },
  
  // Medium credibility - Right-leaning
  'foxnews.com': { name: 'Fox News', lean: 'right', credibility: 2 },
  'nypost.com': { name: 'New York Post', lean: 'right', credibility: 2 },
  'washingtonexaminer.com': { name: 'Washington Examiner', lean: 'right', credibility: 2 },
  'freebeacon.com': { name: 'Washington Free Beacon', lean: 'right', credibility: 2 },
  'reason.com': { name: 'Reason', lean: 'right', credibility: 2 },
  
  // Lower credibility - Left-leaning
  'dailykos.com': { name: 'Daily Kos', lean: 'left', credibility: 1 },
  'rawstory.com': { name: 'Raw Story', lean: 'left', credibility: 1 },
  'occupydemocrats.com': { name: 'Occupy Democrats', lean: 'left', credibility: 1 },
  
  // Lower credibility - Right-leaning
  'dailywire.com': { name: 'Daily Wire', lean: 'right', credibility: 2 },
  'breitbart.com': { name: 'Breitbart', lean: 'right', credibility: 1 },
  'newsmax.com': { name: 'Newsmax', lean: 'right', credibility: 1 },
  'oann.com': { name: 'OANN', lean: 'right', credibility: 1 },
  'thefederalist.com': { name: 'The Federalist', lean: 'right', credibility: 1 },
  'townhall.com': { name: 'Townhall', lean: 'right', credibility: 1 },
  'dailycaller.com': { name: 'Daily Caller', lean: 'right', credibility: 1 },
  'theblaze.com': { name: 'The Blaze', lean: 'right', credibility: 1 },
  'infowars.com': { name: 'InfoWars', lean: 'right', credibility: 0 },
  
  // Fact-checkers
  'snopes.com': { name: 'Snopes', lean: 'center', credibility: 3, type: 'fact-checker' },
  'politifact.com': { name: 'PolitiFact', lean: 'center', credibility: 3, type: 'fact-checker' },
  'factcheck.org': { name: 'FactCheck.org', lean: 'center', credibility: 3, type: 'fact-checker' },
  
  // Government sources
  'whitehouse.gov': { name: 'White House', lean: 'center', credibility: 3, type: 'government' },
  'congress.gov': { name: 'Congress.gov', lean: 'center', credibility: 3, type: 'government' },
  'senate.gov': { name: 'U.S. Senate', lean: 'center', credibility: 3, type: 'government' },
  'house.gov': { name: 'U.S. House', lean: 'center', credibility: 3, type: 'government' },
  'cbo.gov': { name: 'CBO', lean: 'center', credibility: 3, type: 'government' },
  'gao.gov': { name: 'GAO', lean: 'center', credibility: 3, type: 'government' },
  'bls.gov': { name: 'Bureau of Labor Statistics', lean: 'center', credibility: 3, type: 'government' },
  'census.gov': { name: 'U.S. Census', lean: 'center', credibility: 3, type: 'government' },
  'cdc.gov': { name: 'CDC', lean: 'center', credibility: 3, type: 'government' },
  'fbi.gov': { name: 'FBI', lean: 'center', credibility: 3, type: 'government' },
  'justice.gov': { name: 'Dept. of Justice', lean: 'center', credibility: 3, type: 'government' },
  'state.gov': { name: 'State Dept.', lean: 'center', credibility: 3, type: 'government' },
};

function getSourceInfo(url) {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    return SOURCE_DATABASE[hostname] || null;
  } catch {
    return null;
  }
}

function getLeanIcon(lean) {
  switch(lean) {
    case 'left': return '←';
    case 'center-left': return '←';
    case 'center': return '•';
    case 'center-right': return '→';
    case 'right': return '→';
    default: return '?';
  }
}

function getLeanLabel(lean) {
  switch(lean) {
    case 'left': return 'Left';
    case 'center-left': return 'Center-Left';
    case 'center': return 'Center';
    case 'center-right': return 'Center-Right';
    case 'right': return 'Right';
    default: return 'Unknown';
  }
}

function getCredibilityStars(credibility) {
  if (credibility === 0) return '⚠️';
  return '⭐'.repeat(credibility);
}

function getCredibilityLabel(credibility) {
  switch(credibility) {
    case 3: return 'High reliability';
    case 2: return 'Mixed reliability';
    case 1: return 'Low reliability';
    case 0: return 'Very low reliability';
    default: return 'Unknown';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKeyBtn');
  
  const welcomeState = document.getElementById('welcomeState');
  const loadingState = document.getElementById('loadingState');
  const resultsState = document.getElementById('resultsState');
  const errorState = document.getElementById('errorState');
  const nokeyState = document.getElementById('nokeyState');
  const loadingSubtext = document.getElementById('loadingSubtext');
  
  const retryBtn = document.getElementById('retryBtn');
  
  // State
  let currentClaim = null;

  // Check for stored API key
  const storedData = await chrome.storage.local.get(['apiKey', 'lastResults', 'lastClaim']);
  
  if (storedData.apiKey) {
    apiKeyInput.value = storedData.apiKey;
  }

  // Determine initial state
  if (storedData.lastResults && storedData.lastClaim) {
    currentClaim = storedData.lastClaim;
    displayResults(storedData.lastResults);
  } else if (!storedData.apiKey) {
    // No API key set
    hideAllStates();
    nokeyState.classList.remove('hidden');
  }
  // Otherwise stays on welcome state (default in HTML)

  // Settings toggle
  settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // Save API key
  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      await chrome.storage.local.set({ apiKey: key });
      
      // Verify it was saved
      const check = await chrome.storage.local.get(['apiKey']);
      console.log('API key saved:', check.apiKey ? 'yes' : 'no');
      
      settingsPanel.classList.add('hidden');
      
      // If we were showing nokey state, switch to welcome
      if (!nokeyState.classList.contains('hidden')) {
        hideAllStates();
        welcomeState.classList.remove('hidden');
      }
      
      // Brief visual confirmation
      saveKeyBtn.textContent = 'Saved ✓';
      setTimeout(() => saveKeyBtn.textContent = 'Save Key', 1500);
    }
  });

  // Retry button
  retryBtn.addEventListener('click', async () => {
    if (currentClaim) {
      await investigateClaim(currentClaim);
    }
  });

  // New check button - return to welcome state
  const newCheckBtn = document.getElementById('newCheckBtn');
  if (newCheckBtn) {
    newCheckBtn.addEventListener('click', async () => {
      await chrome.storage.local.remove(['lastResults', 'lastClaim']);
      currentClaim = null;
      hideAllStates();
      welcomeState.classList.remove('hidden');
    });
  }

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'investigate') {
      currentClaim = message.text;
      await investigateClaim(message.text);
    }
  });

  // Check if there's a pending claim from context menu
  const pending = await chrome.storage.local.get(['pendingClaim']);
  if (pending.pendingClaim) {
    currentClaim = pending.pendingClaim;
    await chrome.storage.local.remove(['pendingClaim']);
    await investigateClaim(pending.pendingClaim);
  }

  // Poll for new claims while panel is open
  setInterval(async () => {
    const pending = await chrome.storage.local.get(['pendingClaim']);
    if (pending.pendingClaim) {
      currentClaim = pending.pendingClaim;
      await chrome.storage.local.remove(['pendingClaim']);
      await investigateClaim(pending.pendingClaim);
    }
  }, 500);

  function hideAllStates() {
    welcomeState.classList.add('hidden');
    loadingState.classList.add('hidden');
    resultsState.classList.add('hidden');
    errorState.classList.add('hidden');
    nokeyState.classList.add('hidden');
  }

  function showLoading(subtext = 'Searching for sources') {
    hideAllStates();
    loadingState.classList.remove('hidden');
    loadingSubtext.textContent = subtext;
  }

  function showError(message) {
    hideAllStates();
    errorState.classList.remove('hidden');
    document.getElementById('errorText').textContent = message;
  }

  async function investigateClaim(claim) {
    // Check for API key
    const stored = await chrome.storage.local.get(['apiKey']);
    if (!stored.apiKey) {
      hideAllStates();
      nokeyState.classList.remove('hidden');
      return;
    }

    showLoading('Analyzing claim...');

    try {
      // Update loading text through stages
      setTimeout(() => loadingSubtext.textContent = 'Searching the web...', 2000);
      setTimeout(() => loadingSubtext.textContent = 'Checking coverage spectrum...', 6000);
      setTimeout(() => loadingSubtext.textContent = 'Analyzing source credibility...', 10000);
      setTimeout(() => loadingSubtext.textContent = 'Compiling findings...', 14000);

      const response = await callClaudeAPI(stored.apiKey, claim);
      
      // Store results
      await chrome.storage.local.set({ 
        lastResults: response,
        lastClaim: claim 
      });

      displayResults(response);
    } catch (error) {
      console.error('Investigation error:', error);
      showError(error.message || 'Failed to investigate claim. Please try again.');
    }
  }

  async function callClaudeAPI(apiKey, claim) {
    const systemPrompt = `You are CheckIt, a political claim fact-checker. Your job is to verify claims by cross-referencing multiple credible primary sources.

IMPORTANT: Use the web search tool to find current, up-to-date information about the claim. Search for the original source, then verify with multiple independent sources.

VERIFICATION PROCESS:
1. Identify where this claim originated (the original source)
2. Search for independent verification from multiple credible sources
3. Cross-reference facts across sources
4. Deliver a verdict based on source consensus

After searching, respond with ONLY this JSON:

{
  "claim": "The exact claim being investigated",
  "verdict": "TRUE" | "MOSTLY_TRUE" | "MIXED" | "MOSTLY_FALSE" | "FALSE" | "UNVERIFIED",
  "verdict_explanation": "This claim appears to be [TRUE/FALSE] based on verification from [Source A], [Source B], and [Source C]. [One sentence explaining the key evidence.]",
  "original_source": {
    "name": "Where this claim originated",
    "url": "https://original-source-url.com",
    "lean": "left" | "center-left" | "center" | "center-right" | "right",
    "credibility": "high" | "mixed" | "low"
  },
  "verification_sources": [
    {
      "name": "Source that verified/refuted the claim",
      "url": "https://source-url.com",
      "supports_claim": true | false,
      "key_finding": "What this source found"
    },
    {
      "name": "Another verification source",
      "url": "https://source-url.com",
      "supports_claim": true | false,
      "key_finding": "What this source found"
    }
  ],
  "facts": [
    "Key verified fact 1",
    "Key verified fact 2",
    "Key verified fact 3"
  ],
  "flags": ["Any context flags like 'Missing context', 'Outdated data', 'Cherry-picked statistic', etc. Empty array if none."]
}

VERDICT GUIDELINES:
- TRUE: Multiple credible sources confirm the claim
- MOSTLY_TRUE: Sources largely confirm, with minor caveats
- MIXED: Sources disagree or claim is partially true
- MOSTLY_FALSE: Most credible sources contradict the claim
- FALSE: Multiple credible sources definitively refute the claim
- UNVERIFIED: Cannot find sufficient independent verification

CREDIBILITY ASSESSMENT:
- High: Wire services (AP, Reuters), major newspapers of record, government sources
- Mixed: Partisan outlets with fact-checking standards, cable news
- Low: Highly partisan outlets, known for misinformation

POLITICAL LEAN:
- Assess the original source's political lean (left, center-left, center, center-right, right)

KEY RULES:
- Always verify claims with at least 2-3 independent sources
- Prioritize primary sources (official data, direct quotes, documents)
- Note when sources disagree
- Be direct with your verdict
- Use REAL URLs only from your search results

Respond ONLY with the JSON object, no other text.`;

    // Sanitize claim - remove non-ASCII characters that break fetch
    const sanitizedClaim = claim
      .replace(/[^\x00-\x7F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Sanitize API key
    const sanitizedKey = apiKey.replace(/[^\x00-\x7F]/g, '').trim();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': sanitizedKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        tools: [
          {
            type: 'web_search_20250305',
            name: 'web_search'
          }
        ],
        messages: [
          {
            role: 'user',
            content: `Investigate and verify this political claim using web search. Find the original source, assess its credibility and political lean, then cross-reference with multiple independent sources: "${sanitizedClaim}"`
          }
        ],
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    
    // Find the text response (may be after tool use)
    let content = '';
    for (const block of data.content) {
      if (block.type === 'text') {
        content = block.text;
      }
    }
    
    if (!content) {
      throw new Error('No response received');
    }
    
    // Parse JSON response
    try {
      const parsed = JSON.parse(content);
      return cleanCitations(parsed);
    } catch (e) {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return cleanCitations(parsed);
      }
      throw new Error('Failed to parse response');
    }
  }

  // Remove citation markup from response
  function cleanCitations(data) {
    const cleanText = (text) => {
      if (typeof text !== 'string') return text;
      return text
        .replace(/<cite[^>]*>/gi, '')
        .replace(/<\/cite>/gi, '')
        .replace(/]*>/gi, '')
        .replace(/<\/antml:cite>/gi, '')
        .replace(/\[\d+(?:[-,]\d+)*\]/g, '')
        .trim();
    };

    return {
      claim: cleanText(data.claim),
      verdict: data.verdict || 'UNVERIFIED',
      verdict_explanation: cleanText(data.verdict_explanation || 'Unable to determine verdict.'),
      original_source: data.original_source ? {
        name: cleanText(data.original_source.name),
        url: data.original_source.url,
        lean: data.original_source.lean || 'center',
        credibility: data.original_source.credibility || 'mixed'
      } : null,
      verification_sources: (data.verification_sources || []).map(s => ({
        name: cleanText(s.name),
        url: s.url,
        supports_claim: s.supports_claim,
        key_finding: cleanText(s.key_finding)
      })),
      facts: Array.isArray(data.facts) ? data.facts.map(cleanText) : [],
      flags: Array.isArray(data.flags) ? data.flags.map(cleanText) : []
    };
  }

  function displayResults(data) {
    hideAllStates();
    resultsState.classList.remove('hidden');

    // Verdict
    const verdictSection = document.getElementById('verdictSection');
    const verdictBadge = document.getElementById('verdictBadge');
    const verdictExplanation = document.getElementById('verdictExplanation');
    
    if (verdictSection && verdictBadge) {
      verdictSection.classList.remove('hidden');
      
      const verdictConfig = {
        'TRUE': { icon: '✓', label: 'TRUE', class: 'verdict-true' },
        'MOSTLY_TRUE': { icon: '✓', label: 'MOSTLY TRUE', class: 'verdict-mostly-true' },
        'MIXED': { icon: '~', label: 'MIXED', class: 'verdict-mixed' },
        'MOSTLY_FALSE': { icon: '✗', label: 'MOSTLY FALSE', class: 'verdict-mostly-false' },
        'FALSE': { icon: '✗', label: 'FALSE', class: 'verdict-false' },
        'UNVERIFIED': { icon: '?', label: 'UNVERIFIED', class: 'verdict-unverified' }
      };
      
      const config = verdictConfig[data.verdict] || verdictConfig['UNVERIFIED'];
      verdictBadge.innerHTML = `${config.icon} ${config.label}`;
      verdictBadge.className = `verdict-badge ${config.class}`;
      
      if (verdictExplanation) {
        verdictExplanation.textContent = data.verdict_explanation;
      }
    }

    // Claim
    document.getElementById('claimText').textContent = data.claim;

    // Original Source evaluation
    const originalSourceSection = document.getElementById('originalSourceSection');
    const originalSourceContent = document.getElementById('originalSourceContent');
    
    if (originalSourceSection && data.original_source) {
      originalSourceSection.classList.remove('hidden');
      originalSourceContent.innerHTML = '';
      
      const sourceItem = document.createElement('div');
      sourceItem.className = 'original-source-item';
      
      const link = document.createElement('a');
      link.href = data.original_source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = data.original_source.name;
      sourceItem.appendChild(link);
      
      const badges = document.createElement('div');
      badges.className = 'source-badges';
      
      // Political lean badge
      const leanBadge = document.createElement('span');
      leanBadge.className = `lean-badge lean-${data.original_source.lean}`;
      leanBadge.innerHTML = `${getLeanIcon(data.original_source.lean)} ${getLeanLabel(data.original_source.lean)}`;
      badges.appendChild(leanBadge);
      
      // Credibility badge
      const credLabel = data.original_source.credibility === 'high' ? '⭐⭐⭐ High' : 
                        data.original_source.credibility === 'mixed' ? '⭐⭐ Mixed' : '⭐ Low';
      const credBadge = document.createElement('span');
      credBadge.className = `cred-badge cred-${data.original_source.credibility === 'high' ? '3' : data.original_source.credibility === 'mixed' ? '2' : '1'}`;
      credBadge.textContent = credLabel;
      badges.appendChild(credBadge);
      
      sourceItem.appendChild(badges);
      originalSourceContent.appendChild(sourceItem);
    } else if (originalSourceSection) {
      originalSourceSection.classList.add('hidden');
    }

    // Verification Sources
    const verificationSection = document.getElementById('verificationSection');
    const verificationList = document.getElementById('verificationList');
    
    if (verificationSection && data.verification_sources && data.verification_sources.length > 0) {
      verificationSection.classList.remove('hidden');
      verificationList.innerHTML = '';
      
      data.verification_sources.forEach(source => {
        const item = document.createElement('div');
        item.className = `verification-item ${source.supports_claim ? 'supports' : 'refutes'}`;
        
        const header = document.createElement('div');
        header.className = 'verification-header';
        
        const icon = document.createElement('span');
        icon.className = 'verification-icon';
        icon.textContent = source.supports_claim ? '✓' : '✗';
        header.appendChild(icon);
        
        const link = document.createElement('a');
        link.href = source.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = source.name;
        header.appendChild(link);
        
        item.appendChild(header);
        
        const finding = document.createElement('p');
        finding.className = 'verification-finding';
        finding.textContent = source.key_finding;
        item.appendChild(finding);
        
        verificationList.appendChild(item);
      });
    } else if (verificationSection) {
      verificationSection.classList.add('hidden');
    }

    // Facts
    const factsList = document.getElementById('factsList');
    factsList.innerHTML = '';
    if (data.facts && data.facts.length > 0) {
      data.facts.forEach(fact => {
        const li = document.createElement('li');
        li.textContent = fact;
        factsList.appendChild(li);
      });
    }

    // Flags
    const flagsSection = document.getElementById('flagsSection');
    const flagsList = document.getElementById('flagsList');
    flagsList.innerHTML = '';
    
    if (data.flags && data.flags.length > 0) {
      flagsSection.classList.remove('hidden');
      data.flags.forEach(flag => {
        const span = document.createElement('span');
        span.className = 'flag';
        span.innerHTML = `⚠ ${flag}`;
        flagsList.appendChild(span);
      });
    } else {
      flagsSection.classList.add('hidden');
    }
  }
});
