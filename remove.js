function removeElementsByClass(className, useRankChangeNone = false, insertAfterClass = null) {
  const elements = document.querySelectorAll(className);
  elements.forEach(el => {
    if (useRankChangeNone) {
      const template = document.querySelector(".ranking-page-table__column--rank-change-none");
      if (template) {
        const clone = template.cloneNode(true);
        const parent = el.parentElement;
        const siblings = Array.from(parent.children);
        const insertAfter = siblings.find(sib => sib.matches(insertAfterClass));

        if (insertAfter && insertAfter.nextSibling) {
          insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
        } else {
          parent.appendChild(clone);
        }
      }
    }

    el.remove();
  });
}

chrome.storage.sync.get([
  'removeProfilePictures',
  'removeTeams',
  'removeRankChanges',
  'removeCountry'
], (result) => {
  const removalOptions = [
    {
      className: ".avatar.avatar--dynamic-size",
      enabled: result.removeProfilePictures || false
    },
    {
      className: ".flag-team",
      enabled: result.removeTeams || false
    },
    {
      className: ".ranking-page-table__column--rank-change",
      enabled: result.removeRankChanges || false,
      useRankChangeNone: true,
      insertAfter: ".ranking-page-table__column--main"
    },
    {
      className: ".flag-country",
      enabled: result.removeCountry || false
    }
  ];

  function runRemovals() {
    removalOptions.forEach(option => {
      if (option.enabled) {
        removeElementsByClass(option.className, option.useRankChangeNone, option.insertAfter);
      }
    });
  }

  runRemovals();

  const observer = new MutationObserver(runRemovals);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  setInterval(runRemovals, 2000);

  ["popstate", "hashchange"].forEach(event =>
    window.addEventListener(event, runRemovals)
  );

  document.addEventListener("click", e => {
    const navTrigger = e.target.closest("a, button");
    if (navTrigger) {
      [100, 300, 800].forEach(delay =>
        setTimeout(runRemovals, delay)
      );
    }
  });
});
