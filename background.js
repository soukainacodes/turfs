function applyRules(isEnabled, rules) {
  if (isEnabled) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: []
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [],
      removeRuleIds: rules.map(rule => rule.id)
    });
  }
}

// Load rules from rules.json
let cachedRules = [];
fetch(chrome.runtime.getURL("rules.json"))
  .then(response => response.json())
  .then(rules => {
    cachedRules = rules;
    // On install, check toggle and apply rules accordingly
    chrome.storage.sync.get(['adblockEnabled'], (result) => {
      const isEnabled = result.adblockEnabled !== false; // default ON
      applyRules(isEnabled, cachedRules);
    });
  });

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.adblockEnabled && cachedRules.length > 0) {
    applyRules(changes.adblockEnabled.newValue, cachedRules);
  }
});