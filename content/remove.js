const targetURLs = [
  "https://osu.ppy.sh/rankings",
  "https://osu.ppy.sh/beatmapsets",
  "https://osu.ppy.sh/scores",
  "https://osu.ppy.sh/multiplayer",
  "https://osu.ppy.sh/seasons",
  "https://osu.ppy.sh/home/friends"
];

let currentSettings = {
  removeTeams: false,
  removeRankChanges: false,
  removeCountry: false
};

function isOnTargetURL() {
  return targetURLs.some(url => window.location.href.startsWith(url));
}

function toggleElementsByClass(className, shouldHide) {
  const elements = document.querySelectorAll(className);
  elements.forEach(el => {
    el.style.display = shouldHide ? 'none' : '';
  });
}

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

  toggleElementsByClass(".flag-team", currentSettings.removeTeams);

  if (isRankings) {
    const isGlobalRanking = href.startsWith("https://osu.ppy.sh/rankings/osu/global");
    toggleRankChangeColumns(currentSettings.removeRankChanges && isGlobalRanking);
    toggleElementsByClass(".flag-country:not(.flag-country--flat)", currentSettings.removeCountry);
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

let observerTimeout;

const observer = new MutationObserver(() => {
  if (observerTimeout) return;

  observerTimeout = setTimeout(() => {
    runRemovals();
    observerTimeout = null;
  }, 200);
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

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
