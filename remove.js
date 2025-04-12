function removeElementsByClass(className) {
  const elements = document.querySelectorAll(className);
  if (elements.length) {
    elements.forEach(el => el.remove());
  }
}

chrome.storage.sync.get([
  'removeProfilePictures',
  'removeTeams',
  'removeRankChanges',
  'removeCountry'
], (result) => {
  const removalOptions = [
    { className: ".avatar.avatar--dynamic-size", enabled: result.removeProfilePictures || false },
    { className: ".flag-team", enabled: result.removeTeams || false },
    { className: ".ranking-page-table__column--rank-change", enabled: result.removeRankChanges || false },
    { className: ".flag-country", enabled: result.removeCountry || false }
  ];

  removalOptions.forEach(option => {
    if (option.enabled) {
      removeElementsByClass(option.className);
    }
  });

  const observer = new MutationObserver(() => {
    removalOptions.forEach(option => {
      if (option.enabled) {
        removeElementsByClass(option.className);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setInterval(() => {
    removalOptions.forEach(option => {
      if (option.enabled) {
        removeElementsByClass(option.className);
      }
    });
  }, 2000);

  ["popstate", "hashchange"].forEach(event =>
    window.addEventListener(event, () => {
      removalOptions.forEach(option => {
        if (option.enabled) {
          removeElementsByClass(option.className);
        }
      });
    })
  );

  document.addEventListener("click", e => {
    const navTrigger = e.target.closest("a, button");
    if (navTrigger) {
      [100, 300, 800].forEach(delay =>
        setTimeout(() => {
          removalOptions.forEach(option => {
            if (option.enabled) {
              removeElementsByClass(option.className);
            }
          });
        }, delay)
      );
    }
  });
});
