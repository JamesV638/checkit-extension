// Load existing key
chrome.storage.local.get(['apiKey'], function(r) {
  if (r.apiKey) {
    document.getElementById('key').value = r.apiKey;
    document.getElementById('msg').className = 'show';
    document.getElementById('msg').textContent = '✓ Key already saved';
  }
});

// Save key button
document.getElementById('saveBtn').addEventListener('click', function() {
  var k = document.getElementById('key').value.trim();
  if (k) {
    chrome.storage.local.set({apiKey: k}, function() {
      document.getElementById('msg').className = 'show';
      document.getElementById('msg').textContent = '✓ Saved!';
    });
  }
});
