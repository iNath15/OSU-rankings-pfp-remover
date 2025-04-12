chrome.storage.sync.get(['scriptEnabled'], (result) => {
    const isEnabled = result.scriptEnabled || false;
  
    if (isEnabled) {
      console.log("Script is enabled!");
    } else {
      console.log("Script is disabled.");
    }
  });
  