document.addEventListener('DOMContentLoaded', () => {

  const elements = {
    teams: document.getElementById('teams'),
    rankChange: document.getElementById('rankChange'),
    country: document.getElementById('country')
  };

  chrome.storage.local.get([
    'removeTeams',
    'removeRankChanges',
    'removeCountry'
  ], (result) => {

    if (elements.teams)
      elements.teams.checked = result.removeTeams || false;

    if (elements.rankChange)
      elements.rankChange.checked = result.removeRankChanges || false;

    if (elements.country)
      elements.country.checked = result.removeCountry || false;
  });

  if (elements.teams) {
    elements.teams.addEventListener('change', e => {
      chrome.storage.local.set({ removeTeams: e.target.checked });
    });
  }

  if (elements.rankChange) {
    elements.rankChange.addEventListener('change', e => {
      chrome.storage.local.set({ removeRankChanges: e.target.checked });
    });
  }

  if (elements.country) {
    elements.country.addEventListener('change', e => {
      chrome.storage.local.set({ removeCountry: e.target.checked });
    });
  }
});
