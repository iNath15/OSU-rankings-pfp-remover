const targetURLs = [
  "https://osu.ppy.sh/rankings",
  "https://osu.ppy.sh/beatmapsets",
  "https://osu.ppy.sh/scores",
  "https://osu.ppy.sh/multiplayer",
  "https://osu.ppy.sh/seasons",
  "https://osu.ppy.sh/home/friends",
  "https://osu.ppy.sh/users/"
];

let currentSettings = {
  removeTeams: false,
  removeRankChanges: false,
  removeCountry: false
};

function isOnTargetURL() {
  return targetURLs.some(url => window.location.href.startsWith(url));
}

// --- CSS injection instead of manually iterating over elements ---

const styleEl = document.createElement('style');
document.head.appendChild(styleEl);
const sheet = styleEl.sheet;

// Store rule indexes by selector key
const ruleIndexes = {};

function setCSSRule(key, selector, shouldHide) {
  // Remove old rule if one exists
  if (ruleIndexes[key] !== undefined) {
    sheet.deleteRule(ruleIndexes[key]);
    delete ruleIndexes[key];
    // After deletion, indexes shift — recalculate all stored ones
    Object.keys(ruleIndexes).forEach(k => {
      if (ruleIndexes[k] > ruleIndexes[key]) ruleIndexes[k]--;
    });
  }

  if (shouldHide) {
    const idx = sheet.insertRule(`${selector} { display: none !important; }`, sheet.cssRules.length);
    ruleIndexes[key] = idx;
  }
}

// --- Logic for hiding rank-change columns (kept via style, because colspan is needed) ---

function toggleRankChangeColumns(shouldHide) {
  const selectors = [
    ".ranking-page-table__column--rank-change",
    ".ranking-page-table__column--rank-change-none"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = shouldHide ? 'none' : '';
    });
  });

  document.querySelectorAll(".ranking-page-table__column--main").forEach(el => {
    if (shouldHide) {
      el.setAttribute('colspan', '2');
    } else {
      el.removeAttribute('colspan');
    }
  });
}


function runRemovals() {
  if (!isOnTargetURL()) return;

  const href = window.location.href;
  const isRankings = href.startsWith("https://osu.ppy.sh/rankings");
  const isUserPage = href.startsWith("https://osu.ppy.sh/users/");

  // .flag-team — via global CSS (no MutationObserver or setTimeout hacks needed)
  setCSSRule('flagTeam', '.flag-team', currentSettings.removeTeams && !isUserPage);

  if (isRankings) {
    const isGlobalRanking = href.startsWith("https://osu.ppy.sh/rankings/osu/global");
    toggleRankChangeColumns(currentSettings.removeRankChanges && isGlobalRanking);
    // .flag-country — also via CSS
    setCSSRule('flagCountry', '.flag-country:not(.flag-country--flat)', currentSettings.removeCountry);
  } else {
    // If navigated away from the rankings page — remove the country rule
    setCSSRule('flagCountry', '.flag-country:not(.flag-country--flat)', false);
  }
}


function loadSettings(callback) {
  chrome.storage.local.get(
    ['removeTeams', 'removeRankChanges', 'removeCountry'],
    (result) => {
      currentSettings = {
        removeTeams: result.removeTeams || false,
        removeRankChanges: result.removeRankChanges || false,
        removeCountry: result.removeCountry || false
      };
      callback && callback();
    }
  );
}

loadSettings(() => {
  runRemovals();
  if (window.location.href.includes("/rankings/ranked-play/")) {
    setTimeout(runRemovals, 1000);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local') return;

  if (
    changes.removeTeams ||
    changes.removeRankChanges ||
    changes.removeCountry
  ) {
    loadSettings(runRemovals);
  }
});

// --- MutationObserver only for toggleRankChangeColumns (colspan logic) ---
// .flag-team and .flag-country no longer need manual tracking — CSS will apply to new nodes automatically

let observerTimeout = null;

const observer = new MutationObserver(() => {
  if (observerTimeout) return;
  observerTimeout = setTimeout(() => {
    // Only needed for rank-change columns, which can't be covered by pure CSS
    const href = window.location.href;
    if (href.startsWith("https://osu.ppy.sh/rankings")) {
      const isGlobalRanking = href.startsWith("https://osu.ppy.sh/rankings/osu/global");
      toggleRankChangeColumns(currentSettings.removeRankChanges && isGlobalRanking);
    }
    observerTimeout = null;
  }, 200);
});

observer.observe(document.body, { childList: true, subtree: true });

// --- Navigation (SPA) ---

["popstate", "hashchange"].forEach(evt =>
  window.addEventListener(evt, runRemovals)
);

document.addEventListener("click", e => {
  if (e.target.closest("a, button")) {
    [100, 300, 800].forEach(delay =>
      setTimeout(runRemovals, delay)
    );

    if (window.location.href.includes("/rankings/ranked-play/")) {
      setTimeout(runRemovals, 1000);
    }
  }
});
