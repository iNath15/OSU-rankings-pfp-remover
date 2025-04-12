function removeAvatars() {
  chrome.storage.sync.get(["removeAvatars"], (result) => {
    if (!result.removeAvatars) return;
    const avatars = document.querySelectorAll(".avatar.avatar--dynamic-size");
    avatars.forEach((el) => el.remove());
  });
}

function removeFlagTeams() {
  chrome.storage.sync.get(["removeFlags"], (result) => {
    if (!result.removeFlags) return;
    const flags = document.querySelectorAll(".flag-team");
    flags.forEach((el) => el.remove());
  });
}

removeAvatars();
removeFlagTeams();

const observer = new MutationObserver(() => setTimeout(removeAvatars, 50));
observer.observe(document.body, { childList: true, subtree: true });

const flagObserver = new MutationObserver(() =>
  setTimeout(removeFlagTeams, 50)
);
flagObserver.observe(document.body, { childList: true, subtree: true });

setInterval(() => {
  removeAvatars();
  removeFlagTeams();
}, 2000);

["popstate", "hashchange"].forEach((event) =>
  window.addEventListener(event, () => {
    setTimeout(removeAvatars, 100);
    setTimeout(removeFlagTeams, 100);
  })
);

document.addEventListener("click", (e) => {
  const trigger = e.target.closest("a, button");
  if (trigger) {
    [100, 300, 800].forEach((delay) => {
      setTimeout(removeAvatars, delay);
      setTimeout(removeFlagTeams, delay);
    });
  }
});
