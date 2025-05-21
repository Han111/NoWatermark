// Background script for Jimeng AI Watermark Remover

// Listen for installation
chrome.runtime.onInstalled.addListener(function() {
  console.log("即梦AI无水印下载工具已安装");
});

// Listen for tab updates to enable/disable the extension icon
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    // Check if the current tab is on Jimeng AI website
    if (tab.url && tab.url.includes('jimeng.jianying.com')) {
      // Enable the action button for Jimeng AI website
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
    // Check if the current tab is on Jimeng AI website
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      const isOnJimengSite = currentTab && currentTab.url && currentTab.url.includes('jimeng.jianying.com');
      sendResponse({isOnJimengSite: isOnJimengSite});
    });
    return true; // Required for asynchronous response
  }
  
  // Download image
  if (request.action === "downloadImage") {
    try {
      chrome.downloads.download({
        url: request.imageUrl,
        filename: request.filename || "jimeng_image.png",
        saveAs: true
      }, function(downloadId) {
        if (chrome.runtime.lastError) {
          console.error("下载错误:", chrome.runtime.lastError);
          sendResponse({success: false, error: chrome.runtime.lastError.message});
        } else {
          sendResponse({success: true, downloadId: downloadId});
        }
      });
      return true; // Required for asynchronous response
    } catch (err) {
      console.error("处理下载请求时出错:", err);
      sendResponse({success: false, error: err.message});
      return false;
    }
  }
}); 