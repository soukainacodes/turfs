function applyRules(isEnabled, rules) {
  const ruleIds = rules.map(rule => rule.id);
  if (isEnabled) {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules,
      removeRuleIds: ruleIds // Remove old rules before adding new ones
    });
  } else {
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [],
      removeRuleIds: ruleIds
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