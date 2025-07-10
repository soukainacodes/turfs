document.addEventListener('DOMContentLoaded', () => {
  const adSelectors = ['.ad-banner', '.advertisement', '[id^="ad-"]'];
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });
});
