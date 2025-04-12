const avatarToggle = document.getElementById("avatarToggle");
const flagToggle = document.getElementById("flagToggle");

chrome.storage.sync.get(["removeAvatars", "removeFlags"], (result) => {
  avatarToggle.checked = result.removeAvatars ?? true;
  flagToggle.checked = result.removeFlags ?? true;
});

avatarToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ removeAvatars: avatarToggle.checked });
});

flagToggle.addEventListener("change", () => {
  chrome.storage.sync.set({ removeFlags: flagToggle.checked });
});
