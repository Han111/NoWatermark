// Function to add download buttons to images
function addDownloadButtons() {
  console.log("开始查找图片并添加下载按钮...");
  
  try {
    // 查找所有符合条件的图片元素（包括小图和大图）
    const images = document.querySelectorAll('img[crossorigin="anonymous"][src*="byteimg.com"], img.image-DU6JLr');
    
    console.log("找到图片数量:", images.length);
    
    // 处理每张图片
    images.forEach((img, index) => {
      try {
        // 检查是否是即梦AI生成的图片
        if (img.src) {
          console.log(`处理第 ${index+1} 张图片:`, img.src);
          
          // 检查图片是否已经处理过
          if (img.dataset.watermarkProcessed === 'true') {
            console.log("图片已处理过，跳过");
            return;
          }
          
          // 标记图片已处理
          img.dataset.watermarkProcessed = 'true';
          
          // 尝试找到现有的下载按钮
          const downloadButtonContainer = findDownloadButtonContainer(img);
          
          if (downloadButtonContainer) {
            // 如果找到了现有的下载按钮，在其旁边添加我们的按钮
            addButtonsNextToExisting(downloadButtonContainer, img);
          } else {
            // 如果没有找到现有的下载按钮，使用原来的方式添加
            addButtonsToImageContainer(img);
          }
          
          console.log("成功添加下载按钮");
        }
      } catch (err) {
        console.error("处理单个图片时出错:", err);
      }
    });
  } catch (err) {
    console.error("添加下载按钮时出错:", err);
  }
}

// 查找现有的下载按钮容器
function findDownloadButtonContainer(img) {
  // 从图片开始向上查找
  let element = img;
  let container = null;
  
  // 向上最多查找10层
  for (let i = 0; i < 10; i++) {
    if (!element || !element.parentElement) break;
    
    element = element.parentElement;
    
    // 查找现有的下载按钮容器
    const downloadBtn = element.querySelector('.mweb-button-tertiary');
    if (downloadBtn) {
      // 找到了下载按钮，获取其父元素
      const operationsContainer = downloadBtn.closest('div[class*="operation"]');
      if (operationsContainer) {
        container = operationsContainer;
        break;
      }
    }
  }
  
  return container;
}

// 在现有下载按钮旁边添加我们的按钮
function addButtonsNextToExisting(container, img) {
  try {
    // 检查是否已经添加过按钮
    if (container.querySelector('.jimeng-download-btn-container')) {
      return;
    }
    
    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.className = 'jimeng-download-btn-container';
    btnContainer.style.display = 'inline-flex';
    btnContainer.style.marginRight = '10px';
    
    // 创建无水印下载按钮
    const noWatermarkBtn = document.createElement('div');
    noWatermarkBtn.className = 'mweb-button-tertiary mwebButton-vwzuXc operationBtnItem-_GEqBw jimeng-no-watermark-btn';
    noWatermarkBtn.title = '下载无水印图片';
    noWatermarkBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 12.586V3.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v9.086L8.353 9.939a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .708l4.354 4.353a1 1 0 0 0 1.414 0l4.354-4.353a.5.5 0 0 0 0-.708l-.707-.707a.5.5 0 0 0-.708 0L13 12.586Z" fill="currentColor"/>
        <path d="M5 19v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V19H5Z" fill="currentColor"/>
        <circle cx="18" cy="6" r="5" fill="#4CAF50" stroke="white" stroke-width="1"/>
      </svg>
    `;
    
    // 添加点击事件
    noWatermarkBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      // 获取无水印URL
      let cleanUrl = img.src;
      if (cleanUrl.includes('x-signature')) {
        cleanUrl = cleanUrl.replace(/&x-signature=[^&]+/, '');
      }
      
      // 下载图片
      downloadImage(img, cleanUrl, 'jimeng_no_watermark.png');
      return false;
    });
    
    // 添加按钮到容器
    btnContainer.appendChild(noWatermarkBtn);
    
    // 找到第一个子元素
    const firstChild = container.firstChild;
    
    // 将我们的按钮容器插入到第一个子元素之前
    container.insertBefore(btnContainer, firstChild);
    
    console.log("成功在现有下载按钮旁边添加无水印下载按钮");
  } catch (err) {
    console.error("在现有下载按钮旁边添加按钮时出错:", err);
  }
}

// 在图片容器上添加按钮（原来的方式）
function addButtonsToImageContainer(img) {
  try {
    // 获取图片容器
    let container = img.closest('.container-haV1lv') || img.closest('div');
    if (!container) {
      console.log("无法找到图片容器，使用父元素");
      container = img.parentElement;
      if (!container) {
        console.log("无法找到图片父元素，跳过");
        return;
      }
    }
    
    // 确保容器有相对定位
    const containerStyle = window.getComputedStyle(container);
    if (containerStyle.position === 'static') {
      container.style.position = 'relative';
    }
    
    // 创建浮动工具栏
    const toolbar = document.createElement('div');
    toolbar.className = 'jimeng-toolbar';
    toolbar.style.position = 'absolute';
    toolbar.style.bottom = '10px';
    toolbar.style.right = '10px';
    toolbar.style.display = 'none';
    toolbar.style.zIndex = '9999';
    toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    toolbar.style.borderRadius = '5px';
    toolbar.style.padding = '5px';
    toolbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // 创建下载无水印按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'jimeng-download-btn';
    downloadBtn.innerHTML = '下载无水印';
    downloadBtn.style.backgroundColor = '#2196F3';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '3px';
    downloadBtn.style.padding = '5px 10px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.fontSize = '12px';
    downloadBtn.style.marginRight = '5px';
    
    // 下载无水印图片功能
    downloadBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log("点击下载无水印按钮");
      
      // 获取无水印URL
      let cleanUrl = img.src;
      if (cleanUrl.includes('x-signature')) {
        cleanUrl = cleanUrl.replace(/&x-signature=[^&]+/, '');
      }
      
      // 下载图片
      downloadImage(img, cleanUrl, 'jimeng_no_watermark.png');
      return false;
    });
    
    // 创建下载原图按钮
    const downloadOriginalBtn = document.createElement('button');
    downloadOriginalBtn.className = 'jimeng-download-original-btn';
    downloadOriginalBtn.innerHTML = '下载原图';
    downloadOriginalBtn.style.backgroundColor = '#4CAF50';
    downloadOriginalBtn.style.color = 'white';
    downloadOriginalBtn.style.border = 'none';
    downloadOriginalBtn.style.borderRadius = '3px';
    downloadOriginalBtn.style.padding = '5px 10px';
    downloadOriginalBtn.style.cursor = 'pointer';
    downloadOriginalBtn.style.fontSize = '12px';
    
    // 下载原图功能
    downloadOriginalBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      console.log("点击下载原图按钮");
      downloadImage(img, img.src, 'jimeng_original.png');
      return false;
    });
    
    // 添加按钮到工具栏
    toolbar.appendChild(downloadBtn);
    toolbar.appendChild(downloadOriginalBtn);
    
    // 添加工具栏到容器
    container.appendChild(toolbar);
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = 'jimeng-close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '5px';
    closeBtn.style.right = '5px';
    closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    closeBtn.style.color = 'white';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '20px';
    closeBtn.style.height = '20px';
    closeBtn.style.lineHeight = '18px';
    closeBtn.style.fontSize = '14px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.display = 'none';
    closeBtn.style.zIndex = '9999';
    
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      toolbar.style.display = 'none';
      closeBtn.style.display = 'none';
      return false;
    });
    
    container.appendChild(closeBtn);
    
    // 添加点击事件，显示下载按钮
    container.addEventListener('click', function(e) {
      // 如果工具栏已显示，则不做任何操作
      if (toolbar.style.display === 'block') {
        return;
      }
      
      // 隐藏所有其他工具栏
      document.querySelectorAll('.jimeng-toolbar').forEach(t => {
        if (t !== toolbar) {
          t.style.display = 'none';
        }
      });
      
      document.querySelectorAll('.jimeng-close-btn').forEach(b => {
        if (b !== closeBtn) {
          b.style.display = 'none';
        }
      });
      
      // 显示当前工具栏和关闭按钮
      toolbar.style.display = 'block';
      closeBtn.style.display = 'block';
    });
  } catch (err) {
    console.error("在图片容器上添加按钮时出错:", err);
  }
}

// 监听大图弹窗的出现
function watchForPopupImage() {
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // 检查是否有新添加的节点包含大图
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 查找大图元素
            const popupImages = node.querySelectorAll('img.image-DU6JLr[crossorigin="anonymous"], img[crossorigin="anonymous"][src*="byteimg.com"]');
            if (popupImages.length > 0) {
              console.log("检测到弹出大图:", popupImages.length);
              
              // 延迟一下，确保DOM完全加载
              setTimeout(() => {
                popupImages.forEach(img => {
                  // 重置处理标记，强制处理
                  img.dataset.watermarkProcessed = 'false';
                });
                addDownloadButtons();
              }, 500);
            }
            
            // 查找操作按钮容器
            const operationContainers = node.querySelectorAll('div[class*="operation"]');
            if (operationContainers.length > 0) {
              console.log("检测到操作按钮容器:", operationContainers.length);
              
              // 延迟一下，确保DOM完全加载
              setTimeout(() => {
                addDownloadButtons();
              }, 500);
            }
          }
        }
      }
    });
  });
  
  // 开始观察整个文档
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log("已开始监听大图弹窗");
}

// 下载图片函数
function downloadImage(imgElement, imageUrl, filename) {
  try {
    console.log("下载图片:", imageUrl);
    
    // 使用Canvas下载图片
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    
    // 在Canvas上绘制图片
    ctx.drawImage(imgElement, 0, 0);
    
    // 下载图片
    try {
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
    } catch (err) {
      console.error("使用Canvas下载失败，尝试直接下载:", err);
      
      // 备用方案：直接下载
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = filename;
      a.target = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // 清理
      setTimeout(function() {
        document.body.removeChild(a);
      }, 100);
    }
  } catch (err) {
    console.error("下载图片时出错:", err);
  }
}

// 添加全局点击事件，用于隐藏所有工具栏
document.addEventListener('click', function(e) {
  // 检查点击的元素是否是工具栏、按钮或图片容器
  if (!e.target.closest('.jimeng-toolbar') && 
      !e.target.classList.contains('jimeng-close-btn') && 
      !e.target.closest('.container-haV1lv') &&
      !e.target.classList.contains('image-DU6JLr')) {
    // 隐藏所有工具栏和关闭按钮
    document.querySelectorAll('.jimeng-toolbar, .jimeng-close-btn').forEach(el => {
      el.style.display = 'none';
    });
  }
});

// 添加样式
function addStyles() {
  try {
    const styleId = 'jimeng-watermark-remover-styles';
    
    // 检查样式是否已添加
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .jimeng-toolbar {
        display: flex;
        gap: 5px;
        transition: opacity 0.3s;
      }
      .jimeng-download-btn, .jimeng-download-original-btn {
        transition: background-color 0.2s;
      }
      .jimeng-download-btn:hover {
        background-color: #0b7dda !important;
      }
      .jimeng-download-original-btn:hover {
        background-color: #45a049 !important;
      }
      .jimeng-close-btn:hover {
        background-color: rgba(0, 0, 0, 0.8) !important;
      }
      .jimeng-no-watermark-btn {
        cursor: pointer;
      }
      .jimeng-no-watermark-btn:hover {
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
    console.log("已添加样式");
  } catch (err) {
    console.error("添加样式时出错:", err);
  }
}

// 初始化函数
function initialize() {
  console.log("即梦AI无水印下载工具初始化...");
  addStyles();
  addDownloadButtons();
  watchForPopupImage(); // 监听大图弹窗
  
  // 定期检查新图片
  setInterval(addDownloadButtons, 3000);
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// 监听页面变化
const observer = new MutationObserver(function(mutations) {
  let hasNewImages = false;
  
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length > 0) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'IMG' || node.querySelector('img')) {
            hasNewImages = true;
            break;
          }
        }
      }
    }
  });
  
  if (hasNewImages) {
    console.log("检测到DOM变化，有新图片添加");
    addDownloadButtons();
  }
});

// 开始观察文档变化
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// 处理来自扩展弹出窗口的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "removeWatermark") {
    addDownloadButtons();
    sendResponse({status: "正在处理图片"});
  }
  return true;
}); 