// Function to add download buttons to images
function addDownloadButtons() {
  try {
    // 检测当前网站
    const isDubao = window.location.hostname.includes('www.doubao.com');
    const isJimeng = window.location.hostname.includes('jimeng.jianying.com');
    
    if (!isDubao && !isJimeng) {
      return;
    }
    
    let images = [];
    
    // 根据不同网站查找图片元素
    if (isJimeng) {
      // 即梦AI的图片选择器
      images = document.querySelectorAll('img[crossorigin="anonymous"][src*="byteimg.com"], img.image-DU6JLr');
    } else if (isDubao) {
      // 豆包的图片选择器 - 包括大图和小图
      images = document.querySelectorAll('img[data-testid="in_painting_picture"], img[src*="byteimg.com"][class*="preview-img"], img.image-RiuBvC[src*="byteimg.com"]');
    }
    
    // 处理每张图片
    images.forEach((img, index) => {
      try {
        // 检查是否有图片源
        if (img.src) {
          // 检查图片是否已经处理过
          if (img.dataset.watermarkProcessed === 'true') {
            return;
          }
          
          // 标记图片已处理
          img.dataset.watermarkProcessed = 'true';
          
          // 尝试找到现有的下载按钮
          const downloadButtonContainer = findDownloadButtonContainer(img, isDubao);
          
          if (downloadButtonContainer) {
            // 如果找到了现有的下载按钮，在其旁边添加我们的按钮
            addButtonsNextToExisting(downloadButtonContainer, img, isDubao);
          } else {
            // 如果没有找到现有的下载按钮，使用原来的方式添加
            addButtonsToImageContainer(img, isDubao);
          }
        }
      } catch (err) {
        // 错误处理
      }
    });
  } catch (err) {
    // 错误处理
  }
}

// 查找现有的下载按钮容器
function findDownloadButtonContainer(img, isDubao) {
  // 从图片开始向上查找
  let element = img;
  let container = null;
  
  // 向上最多查找10层
  for (let i = 0; i < 10; i++) {
    if (!element || !element.parentElement) break;
    
    element = element.parentElement;
    
    // 根据不同网站查找下载按钮容器
    if (isDubao) {
      // 豆包的下载按钮
      const downloadBtn = element.querySelector('[data-testid="edit_image_download_button"]');
      if (downloadBtn) {
        container = downloadBtn.parentElement;
        break;
      }
    } else {
      // 即梦AI的下载按钮
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
  }
  
  return container;
}

// 在现有下载按钮旁边添加我们的按钮
function addButtonsNextToExisting(container, img, isDubao) {
  try {
    // 检查是否已经添加过按钮
    const btnClass = isDubao ? 'doubao-download-btn-container' : 'jimeng-download-btn-container';
    if (container.querySelector('.' + btnClass)) {
      return;
    }
    
    // 创建按钮容器
    const btnContainer = document.createElement('div');
    btnContainer.className = btnClass;
    btnContainer.style.display = 'inline-flex';
    btnContainer.style.marginRight = '10px';
    
    // 创建下载原图按钮
    const downloadBtn = document.createElement('div');
    
    if (isDubao) {
      downloadBtn.className = 'right-label-btn-wrapper-VRGRva hover-qCVMA7 doubao-download-original-btn';
      downloadBtn.title = '下载原图';
      downloadBtn.innerHTML = `
        <span role="img" class="semi-icon semi-icon-default !text-16">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.207 12.207a1 1 0 0 0-1.414-1.414L13 16.586V2a1 1 0 1 0-2 0v14.586l-5.793-5.793a1 1 0 0 0-1.414 1.414l7.5 7.5c.195.195.45.293.706.293H5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2h-6.999a1 1 0 0 0 .706-.293z"></path>
          </svg>
        </span>
        <span class="btn-label-TbdJ1L">下载原图</span>
      `;
    } else {
      downloadBtn.className = 'mweb-button-tertiary mwebButton-vwzuXc operationBtnItem-_GEqBw jimeng-download-original-btn';
      downloadBtn.title = '下载原图';
      downloadBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 12.586V3.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v9.086L8.353 9.939a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .708l4.354 4.353a1 1 0 0 0 1.414 0l4.354-4.353a.5.5 0 0 0 0-.708l-.707-.707a.5.5 0 0 0-.708 0L13 12.586Z" fill="currentColor"/>
          <path d="M5 19v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5V19H5Z" fill="currentColor"/>
        </svg>
      `;
    }
    
    // 添加点击事件
    downloadBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      
      // 下载图片
      const filename = isDubao ? 'doubao_original.png' : 'jimeng_original.png';
      downloadImage(img, img.src, filename);
      return false;
    });
    
    // 添加按钮到容器
    btnContainer.appendChild(downloadBtn);
    
    // 找到第一个子元素
    const firstChild = container.firstChild;
    
    // 将我们的按钮容器插入到第一个子元素之前
    container.insertBefore(btnContainer, firstChild);
  } catch (err) {
    // 错误处理
  }
}

// 在图片容器上添加按钮（原来的方式）
function addButtonsToImageContainer(img, isDubao) {
  try {
    // 获取图片容器
    let container = img.closest('.container-haV1lv') || img.closest('div');
    if (!container) {
      container = img.parentElement;
      if (!container) {
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
    toolbar.className = isDubao ? 'doubao-toolbar' : 'jimeng-toolbar';
    toolbar.style.position = 'absolute';
    toolbar.style.bottom = '10px';
    toolbar.style.right = '10px';
    toolbar.style.display = 'none';
    toolbar.style.zIndex = '9999';
    toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    toolbar.style.borderRadius = '5px';
    toolbar.style.padding = '5px';
    toolbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    
    // 创建下载原图按钮
    const downloadOriginalBtn = document.createElement('button');
    downloadOriginalBtn.className = isDubao ? 'doubao-download-original-btn' : 'jimeng-download-original-btn';
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
      const filename = isDubao ? 'doubao_original.png' : 'jimeng_original.png';
      downloadImage(img, img.src, filename);
      return false;
    });
    
    // 添加按钮到工具栏
    toolbar.appendChild(downloadOriginalBtn);
    
    // 添加工具栏到容器
    container.appendChild(toolbar);
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.className = isDubao ? 'doubao-close-btn' : 'jimeng-close-btn';
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
      document.querySelectorAll('.jimeng-toolbar, .doubao-toolbar').forEach(t => {
        if (t !== toolbar) {
          t.style.display = 'none';
        }
      });
      
      document.querySelectorAll('.jimeng-close-btn, .doubao-close-btn').forEach(b => {
        if (b !== closeBtn) {
          b.style.display = 'none';
        }
      });
      
      // 显示当前工具栏和关闭按钮
      toolbar.style.display = 'block';
      closeBtn.style.display = 'block';
    });
  } catch (err) {
    // 错误处理
  }
}

// 监听大图弹窗的出现
function watchForPopupImage() {
  // 检测当前网站
  const isDubao = window.location.hostname.includes('www.doubao.com');
  const isJimeng = window.location.hostname.includes('jimeng.jianying.com');
  
  if (!isDubao && !isJimeng) {
    return;
  }
  
  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        // 检查是否有新添加的节点包含大图
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            let popupImages = [];
            
            if (isJimeng) {
              // 即梦AI的大图选择器
              popupImages = node.querySelectorAll('img.image-DU6JLr[crossorigin="anonymous"], img[crossorigin="anonymous"][src*="byteimg.com"]');
            } else if (isDubao) {
              // 豆包的大图选择器
              popupImages = node.querySelectorAll('img[data-testid="in_painting_picture"], img.image-RiuBvC[src*="byteimg.com"]');
            }
            
            if (popupImages.length > 0) {
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
            let operationContainers = [];
            
            if (isJimeng) {
              operationContainers = node.querySelectorAll('div[class*="operation"]');
            } else if (isDubao) {
              operationContainers = node.querySelectorAll('[data-testid="edit_image_download_button"]');
            }
            
            if (operationContainers.length > 0) {
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
}

// 下载图片函数
function downloadImage(imgElement, imageUrl, filename) {
  try {
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
      // 使用Fetch API下载图片，防止页面跳转
      fetch(imageUrl)
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
        })
        .catch(fetchErr => {
          // 最后的备用方案：使用chrome.downloads API
          if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
              action: "downloadImage",
              imageUrl: imageUrl,
              filename: filename
            }, function(response) {
              // 处理响应
            });
          } else {
            // 如果chrome API不可用，尝试最后的方法
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = filename;
            a.target = '_blank';
            a.style.display = 'none';
            document.body.appendChild(a);
            
            // 使用click()方法，而不是直接设置location
            a.click();
            
            // 清理
            setTimeout(function() {
              document.body.removeChild(a);
            }, 100);
          }
        });
    }
  } catch (err) {
    // 错误处理
  }
}

// 添加全局点击事件，用于隐藏所有工具栏
document.addEventListener('click', function(e) {
  // 检查点击的元素是否是工具栏、按钮或图片容器
  if (!e.target.closest('.jimeng-toolbar, .doubao-toolbar') && 
      !e.target.classList.contains('jimeng-close-btn') && 
      !e.target.classList.contains('doubao-close-btn') && 
      !e.target.closest('.container-haV1lv') &&
      !e.target.classList.contains('image-DU6JLr') &&
      !e.target.classList.contains('image-RiuBvC')) {
    // 隐藏所有工具栏和关闭按钮
    document.querySelectorAll('.jimeng-toolbar, .jimeng-close-btn, .doubao-toolbar, .doubao-close-btn').forEach(el => {
      el.style.display = 'none';
    });
  }
});

// 添加样式
function addStyles() {
  try {
    const styleId = 'ai-watermark-remover-styles';
    
    // 检查样式是否已添加
    if (document.getElementById(styleId)) {
      return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .jimeng-toolbar, .doubao-toolbar {
        display: flex;
        gap: 5px;
        transition: opacity 0.3s;
      }
      .jimeng-download-original-btn,
      .doubao-download-original-btn {
        transition: background-color 0.2s;
      }
      .jimeng-download-original-btn:hover,
      .doubao-download-original-btn:hover {
        background-color: #45a049 !important;
      }
      .jimeng-close-btn:hover,
      .doubao-close-btn:hover {
        background-color: rgba(0, 0, 0, 0.8) !important;
      }
    `;
    document.head.appendChild(style);
  } catch (err) {
    // 错误处理
  }
}

// 初始化函数
function initialize() {
  // 检测当前网站
  const isDubao = window.location.hostname.includes('www.doubao.com');
  const isJimeng = window.location.hostname.includes('jimeng.jianying.com');
  
  if (!isDubao && !isJimeng) {
    return;
  }
  
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