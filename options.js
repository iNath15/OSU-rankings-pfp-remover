document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.sync.get(['removeProfilePictures', 'removeTeams', 'removeRankChanges', 'removeCountry'], (result) => {
    document.getElementById('pfp').checked = result.removeProfilePictures || false;
    document.getElementById('teams').checked = result.removeTeams || false;
    document.getElementById('rankChange').checked = result.removeRankChanges || false;
    document.getElementById('country').checked = result.removeCountry || false;
  });
});

document.getElementById('pfp').addEventListener('change', (event) => {
  chrome.storage.sync.set({ removeProfilePictures: event.target.checked });
});

document.getElementById('teams').addEventListener('change', (event) => {
  chrome.storage.sync.set({ removeTeams: event.target.checked });
});

document.getElementById('rankChange').addEventListener('change', (event) => {
  chrome.storage.sync.set({ removeRankChanges: event.target.checked });
});

document.getElementById('country').addEventListener('change', (event) => {
  chrome.storage.sync.set({ removeCountry: event.target.checked });
});
