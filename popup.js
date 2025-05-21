// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get references to the buttons and status element
  const removeWatermarkBtn = document.getElementById('removeWatermark');
  const downloadImageBtn = document.getElementById('downloadImage');
  const statusElement = document.getElementById('status');
  
  // Check if we're on a supported website
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab.url.includes('jimeng.jianying.com') || currentTab.url.includes('www.doubao.com')) {
      statusElement.textContent = '插件已激活，可以使用';
      statusElement.style.color = '#4CAF50';
    } else {
      statusElement.textContent = '请在支持的AI网站上使用此插件';
      statusElement.style.color = '#f44336';
      if (removeWatermarkBtn) removeWatermarkBtn.disabled = true;
      if (downloadImageBtn) downloadImageBtn.disabled = true;
    }
  });
  
  // Add click event listener to the remove watermark button if it exists
  if (removeWatermarkBtn) {
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
  }
  
  // Add click event listener to the download image button if it exists
  if (downloadImageBtn) {
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
          statusElement.textContent = '发生错误';
          statusElement.style.color = '#f44336';
        });
      });
    });
  }
});

// 定义下载函数以便在目标页面执行
function downloadImageWithoutWatermark() {
  // Find the visible image based on the current website
  let img;
  
  if (window.location.hostname.includes('jimeng.jianying.com')) {
    img = document.querySelector('img[crossorigin="anonymous"]:not([style*="display: none"])');
  } else if (window.location.hostname.includes('www.doubao.com')) {
    // 尝试查找豆包的图片元素（先查找大图，再查找小图）
    img = document.querySelector('img[data-testid="in_painting_picture"]') || 
          document.querySelector('img.image-RiuBvC[src*="byteimg.com"]');
  }
  
  if (img) {
    // 准备文件名
    const filename = window.location.hostname.includes('www.doubao.com') ? 
                    'doubao_original.png' : 'ai_image_original.png';
    
    try {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      
      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0);
      
      // 使用Blob和URL.createObjectURL下载
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(function() {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/png');
      
      return "图片下载成功";
    } catch (canvasErr) {
      // 使用Fetch API下载
      try {
        fetch(img.src)
          .then(response => response.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(function() {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }, 100);
          });
        
        return "图片下载成功";
      } catch (fetchErr) {
        // 使用chrome.downloads API下载
        if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({
            action: "downloadImage",
            imageUrl: img.src,
            filename: filename
          });
          
          return "图片下载请求已发送";
        }
      }
    }
    
    return "图片下载中...";
  } else {
    return "未找到图片";
  }
} 