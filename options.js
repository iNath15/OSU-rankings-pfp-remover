document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.local.get(['removeProfilePictures', 'makeProfilePicturesBigger', 'removeTeams', 'removeRankChanges', 'removeCountry'], (result) => {
    document.getElementById('pfp').checked = result.removeProfilePictures || false;
    document.getElementById('pfpSize').checked = result.makeProfilePicturesBigger || false;
    document.getElementById('teams').checked = result.removeTeams || false;
    document.getElementById('rankChange').checked = result.removeRankChanges || false;
    document.getElementById('country').checked = result.removeCountry || false;
  });
});

document.getElementById('pfp').addEventListener('change', (event) => {
  chrome.storage.local.set({ removeProfilePictures: event.target.checked });
});

document.getElementById('pfpSize').addEventListener('change', (event) => {
  chrome.storage.local.set({ makeProfilePicturesBigger: event.target.checked });
})

document.getElementById('teams').addEventListener('change', (event) => {
  chrome.storage.local.set({ removeTeams: event.target.checked });
});

document.getElementById('rankChange').addEventListener('change', (event) => {
  chrome.storage.local.set({ removeRankChanges: event.target.checked });
});

document.getElementById('country').addEventListener('change', (event) => {
  chrome.storage.local.set({ removeCountry: event.target.checked });
});
