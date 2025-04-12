function removeAvatars() {
    const avatars = document.querySelectorAll(".avatar.avatar--dynamic-size");
    if (avatars.length) {
      avatars.forEach(el => el.remove());
    }
  }
  
  removeAvatars();
  
  const observer = new MutationObserver(() => {
    setTimeout(removeAvatars, 50);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  setInterval(removeAvatars, 2000);

  ["popstate", "hashchange"].forEach(event =>
    window.addEventListener(event, () => setTimeout(removeAvatars, 100))
  );
  
  document.addEventListener("click", e => {
    const navTrigger = e.target.closest("a, button");
    if (navTrigger) {
      [100, 300, 800].forEach(delay =>
        setTimeout(removeAvatars, delay)
      );
    }
  });
  