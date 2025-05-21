// 创建图标文件的脚本
const fs = require('fs');
const path = require('path');

// 确保images目录存在
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

// 创建一个简单的彩色方块作为图标
function createColorSquare(size, color) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // 绘制背景
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  
  // 绘制文字
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size/3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JM', size/2, size/2);
  
  return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
}

// 无法在Node.js环境直接使用canvas，这里只是示例代码
// 实际情况下，你需要使用一个真实的PNG文件 