const toggleSwitch = document.getElementById('toggleSwitch');
const toggleStatus = document.getElementById('toggleStatus');

// Helper to update status text
function updateStatus(isEnabled) {
  toggleStatus.textContent = isEnabled ? 'turfs is ON' : 'turfs is OFF';
}

// Try to get the stored value, fallback to true
chrome.storage.sync.get(['adblockEnabled'], function(result) {
  let isEnabled = true;
  if (chrome.runtime.lastError) {
    // If there's an error, fallback to true
    isEnabled = true;
  } else if (typeof result.adblockEnabled === "boolean") {
    isEnabled = result.adblockEnabled;
  }
  toggleSwitch.checked = isEnabled;
  updateStatus(isEnabled);
});

toggleSwitch.addEventListener('change', function() {
  const isEnabled = toggleSwitch.checked;
  chrome.storage.sync.set({ adblockEnabled: isEnabled }, function() {
    updateStatus(isEnabled);
  });
});