// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the buttons and status element
  const removeWatermarkBtn = document.getElementById('removeWatermark');
  const downloadImageBtn = document.getElementById('downloadImage');
  const statusElement = document.getElementById('status');
  
  // Check if we're on the Jimeng AI website
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab.url.includes('jimeng.jianying.com')) {
      statusElement.textContent = '插件已激活，可以使用';
      statusElement.style.color = '#4CAF50';
    } else {
      statusElement.textContent = '请在即梦AI网站上使用此插件';
      statusElement.style.color = '#f44336';
      removeWatermarkBtn.disabled = true;
      downloadImageBtn.disabled = true;
    }
  });
  
  // Add click event listener to the remove watermark button
  removeWatermarkBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "removeWatermark"}, function(response) {
        if (response && response.status) {
          statusElement.textContent = '水印已移除';
          statusElement.style.color = '#4CAF50';
        }
      });
    });
  });
  
  // Add click event listener to the download image button
  downloadImageBtn.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      // 使用chrome.scripting.executeScript替代已弃用的chrome.tabs.executeScript
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: downloadImageWithoutWatermark
      }).then(result => {
        if (result && result[0] && result[0].result) {
          statusElement.textContent = result[0].result;
          statusElement.style.color = '#4CAF50';
        } else {
          statusElement.textContent = '无法下载图片';
          statusElement.style.color = '#f44336';
        }
      }).catch(error => {
        statusElement.textContent = '发生错误: ' + error.message;
        statusElement.style.color = '#f44336';
      });
    });
  });
});

// 定义下载函数以便在目标页面执行
function downloadImageWithoutWatermark() {
  // Find the visible image
  const img = document.querySelector('img[crossorigin="anonymous"]:not([style*="display: none"])');
  if (img) {
    // Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0);
    
    // Create a download link
    const link = document.createElement('a');
    link.download = 'jimeng_image_no_watermark.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    return "图片下载成功";
  } else {
    return "未找到图片";
  }
} 