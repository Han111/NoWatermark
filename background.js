// Background script for AI Watermark Remover

// Listen for installation
chrome.runtime.onInstalled.addListener(function() {
  // Extension installed
});

// Listen for tab updates to enable/disable the extension icon
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    // Check if the current tab is on supported websites
    if (tab.url && (tab.url.includes('jimeng.jianying.com') || tab.url.includes('www.doubao.com'))) {
      // Enable the action button for supported websites
      chrome.action.enable(tabId);
    } else {
      // Disable the action button for other websites
      chrome.action.disable(tabId);
    }
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "checkStatus") {
    // Check if the current tab is on supported websites
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      const isOnSupportedSite = currentTab && currentTab.url && 
        (currentTab.url.includes('jimeng.jianying.com') || currentTab.url.includes('www.doubao.com'));
      sendResponse({isOnSupportedSite: isOnSupportedSite});
    });
    return true; // Required for asynchronous response
  }
  
  // Download image
  if (request.action === "downloadImage") {
    try {
      chrome.downloads.download({
        url: request.imageUrl,
        filename: request.filename || "ai_image.png",
        saveAs: true
      }, function(downloadId) {
        if (chrome.runtime.lastError) {
          sendResponse({success: false, error: chrome.runtime.lastError.message});
        } else {
          sendResponse({success: true, downloadId: downloadId});
        }
      });
      return true; // Required for asynchronous response
    } catch (err) {
      sendResponse({success: false, error: err.message});
      return false;
    }
  }
}); 