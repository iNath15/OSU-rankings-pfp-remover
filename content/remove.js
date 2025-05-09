const targetURL = "https://osu.ppy.sh/rankings";

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

function fixNameContainer() {
  const mainColumns = document.querySelectorAll(".ranking-page-table__column--main");
  
  mainColumns.forEach(column => {
    column.style.width = "auto";
    column.style.minWidth = "250px";
    
    const nameElement = column.querySelector(".ranking-page-table-main__link-text");
    if (nameElement) {
      nameElement.style.maxWidth = "none";
      nameElement.style.overflow = "visible";
      nameElement.style.textOverflow = "initial";
    }
  });
}

function makeProfilePicturesBigger(className) {
  const elements = document.querySelectorAll(className);
  elements.forEach(el => {
    if (!el.classList.contains("profile-big")) {
      el.style.width = '30px';
      el.style.height = '30px';
      el.classList.add("profile-big");
    }
  });
}

function isOnTargetURL() {
  return window.location.href.startsWith(targetURL);
}

chrome.storage.local.get([
  'removeProfilePictures',
  'makeProfilePicturesBigger',
  'removeTeams',
  'removeRankChanges',
  'removeCountry'
], (result) => {
  const shouldRemoveProfilePics = result.removeProfilePictures || false;
  const shouldMakePicsBigger = result.makeProfilePicturesBigger || false;

  const removalOptions = [
    {
      className: ".avatar.avatar--dynamic-size",
      enabled: shouldRemoveProfilePics
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
    if (!isOnTargetURL()) return;

    removalOptions.forEach(option => {
      if (option.enabled) {
        removeElementsByClass(option.className, option.useRankChangeNone, option.insertAfter);
      }
    });

    if (!shouldRemoveProfilePics && shouldMakePicsBigger) {
      makeProfilePicturesBigger(".avatar.avatar--dynamic-size");
    }
    
    if (result.removeRankChanges) {
      fixNameContainer();
    }
  }

  runRemovals();

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