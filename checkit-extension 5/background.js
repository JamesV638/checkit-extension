// CheckIt Background Service Worker

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'checkit-investigate',
    title: 'CheckIt: Investigate Claim',
    contexts: ['selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'checkit-investigate' && info.selectionText) {
    const claim = info.selectionText.trim();
    
    // Send message to content script to open panel
    chrome.tabs.sendMessage(tab.id, {
      action: 'openPanel',
      claim: claim
    });
  }
});

// Listen for API requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkClaim') {
    handleClaimCheck(message.claim, message.apiKey)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (message.action === 'getApiKey') {
    chrome.storage.local.get(['apiKey'])
      .then(result => sendResponse({ apiKey: result.apiKey }))
      .catch(error => sendResponse({ apiKey: null }));
    return true;
  }
});

// API call handler
async function handleClaimCheck(claim, apiKey) {
  const systemPrompt = `You are CheckIt, a political claim fact-checker. Your job is to verify claims using NON-PARTISAN primary sources only.

IMPORTANT: Use the web search tool to find current, up-to-date information about the claim.

VERIFICATION RULES:
1. BASE YOUR VERDICT ONLY ON NON-PARTISAN PRIMARY SOURCES:
   - Wire services: AP, Reuters, AFP
   - Government data: BLS, Census, CBO, official .gov sites
   - Academic/research: universities, peer-reviewed studies
   - Fact-checkers: PolitiFact, FactCheck.org, Snopes
   - Official documents: court records, legislation, SEC filings

2. DO NOT use partisan media to determine truth:
   - Left-leaning (DO NOT use for verdict): CNN, MSNBC, NYT opinion, HuffPost, Vox
   - Right-leaning (DO NOT use for verdict): Fox News, NY Post, Breitbart, Daily Wire, Newsmax
   - You may SHOW what partisan sources are saying, but they should NOT influence your verdict

3. Show partisan coverage separately so users can see how different sides frame the issue

After searching, respond with ONLY this JSON:

{
  "claim": "The exact claim being investigated",
  "verdict": "TRUE" | "MOSTLY_TRUE" | "MIXED" | "MOSTLY_FALSE" | "FALSE" | "UNVERIFIED",
  "verdict_explanation": "Based on [non-partisan source A] and [non-partisan source B], this claim is [TRUE/FALSE]. [Key evidence.]",
  "original_source": {
    "name": "Where this claim originated",
    "url": "https://original-source-url.com",
    "lean": "left" | "center-left" | "center" | "center-right" | "right",
    "credibility": "high" | "mixed" | "low"
  },
  "verification_sources": [
    {
      "name": "Non-partisan source that verified/refuted",
      "url": "https://source-url.com",
      "supports_claim": true | false,
      "key_finding": "What this source found"
    }
  ],
  "partisan_coverage": {
    "left": {"source": "Source name", "url": "https://...", "summary": "How they're framing it"},
    "right": {"source": "Source name", "url": "https://...", "summary": "How they're framing it"}
  },
  "facts": ["Key verified fact 1", "Key verified fact 2", "Key verified fact 3"],
  "flags": ["Context flags if any"]
}

VERDICT GUIDELINES:
- TRUE: Multiple non-partisan sources confirm
- MOSTLY_TRUE: Largely confirmed with minor caveats
- MIXED: Sources disagree or claim is partially true
- MOSTLY_FALSE: Non-partisan sources mostly contradict
- FALSE: Non-partisan sources definitively refute
- UNVERIFIED: Cannot find non-partisan verification

Rules:
- ONLY use non-partisan sources to determine verdict
- Show partisan coverage for context, but don't let it influence your verdict
- Use real URLs only
- Be direct with verdict`;

  const sanitizedClaim = claim
    .replace(/[^\x00-\x7F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{
        role: 'user',
        content: `Investigate and verify this political claim using web search: "${sanitizedClaim}"`
      }],
      system: systemPrompt
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'API request failed');
  }

  const data = await response.json();
  
  let content = '';
  for (const block of data.content) {
    if (block.type === 'text') {
      content += block.text;
    }
  }
  
  if (!content) {
    throw new Error('No response received');
  }
  
  // Clean and parse response
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
  
  let parsed;
  try {
    // First try direct parse
    parsed = JSON.parse(content);
  } catch (e) {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // Clean up common issues
        let jsonStr = jsonMatch[0]
          .replace(/[\u0000-\u001F]+/g, ' ')  // Remove control characters
          .replace(/,\s*}/g, '}')  // Remove trailing commas
          .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
        parsed = JSON.parse(jsonStr);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (e2) {
      console.error('Parse error:', e2, 'Content:', content.substring(0, 500));
      throw new Error('Failed to parse response');
    }
  }
  
  return {
    claim: cleanText(parsed.claim) || 'Unknown claim',
    verdict: parsed.verdict || 'UNVERIFIED',
    verdict_explanation: cleanText(parsed.verdict_explanation) || 'Unable to determine verdict.',
    original_source: parsed.original_source ? {
      name: cleanText(parsed.original_source.name) || 'Unknown',
      url: parsed.original_source.url || '#',
      lean: parsed.original_source.lean || 'center',
      credibility: parsed.original_source.credibility || 'mixed'
    } : null,
    verification_sources: Array.isArray(parsed.verification_sources) ? parsed.verification_sources.map(s => ({
      name: cleanText(s.name) || 'Unknown',
      url: s.url || '#',
      supports_claim: !!s.supports_claim,
      key_finding: cleanText(s.key_finding) || ''
    })) : [],
    partisan_coverage: parsed.partisan_coverage ? {
      left: parsed.partisan_coverage.left ? {
        source: cleanText(parsed.partisan_coverage.left.source) || '',
        url: parsed.partisan_coverage.left.url || '#',
        summary: cleanText(parsed.partisan_coverage.left.summary) || ''
      } : null,
      right: parsed.partisan_coverage.right ? {
        source: cleanText(parsed.partisan_coverage.right.source) || '',
        url: parsed.partisan_coverage.right.url || '#',
        summary: cleanText(parsed.partisan_coverage.right.summary) || ''
      } : null
    } : null,
    facts: Array.isArray(parsed.facts) ? parsed.facts.map(cleanText) : [],
    flags: Array.isArray(parsed.flags) ? parsed.flags.filter(f => f).map(cleanText) : []
  };
}
