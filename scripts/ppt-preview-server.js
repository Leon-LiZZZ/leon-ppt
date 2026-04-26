#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// ─── 配置 ───────────────────────────────────────────────────────
const PORT = process.env.PPT_PREVIEW_PORT || 18880;
const HOST = process.env.PPT_PREVIEW_HOST || '0.0.0.0';
const SKILL_DIR = path.dirname(__dirname);
const OUTPUT_DIR = path.join(SKILL_DIR, 'output');

// ─── MIME类型 ───────────────────────────────────────────────────
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.json': 'application/json; charset=utf-8'
};

// ─── 日志函数 ───────────────────────────────────────────────────
const log = {
  info: (msg) => console.log(`\x1b[32m[INFO]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`)
};

// ─── 获取文件列表 ───────────────────────────────────────────────
function getPPTFiles() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    return [];
  }
  
  return fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.pptx'))
    .map(f => {
      const stat = fs.statSync(path.join(OUTPUT_DIR, f));
      return {
        name: f,
        size: (stat.size / 1024).toFixed(2) + ' KB',
        time: stat.mtime.toISOString().replace('T', ' ').substring(0, 19)
      };
    })
    .sort((a, b) => b.time.localeCompare(a.time));
}

// ─── 生成HTML页面 ───────────────────────────────────────────────
function generateHTML(pptFiles) {
  const fileList = pptFiles.map(f => `
    <div class="ppt-item">
      <div class="ppt-icon">📊</div>
      <div class="ppt-info">
        <div class="ppt-name">${f.name}</div>
        <div class="ppt-meta">
          <span>📦 ${f.size}</span>
          <span>🕐 ${f.time}</span>
        </div>
      </div>
      <div class="ppt-actions">
        <button class="btn-preview" onclick="previewPPT('${f.name}')">👁️ 预览</button>
        <a class="btn-download" href="/download/${f.name}" download>⬇️ 下载</a>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leon PPT 预览中心</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; color: white; margin-bottom: 40px; }
    .header h1 { font-size: 48px; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
    .header p { font-size: 18px; opacity: 0.9; }
    .stats { display: flex; justify-content: center; gap: 30px; margin: 30px 0; }
    .stat-item {
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      padding: 20px 40px;
      border-radius: 15px;
      color: white;
      text-align: center;
    }
    .stat-number { font-size: 36px; font-weight: bold; }
    .stat-label { font-size: 14px; opacity: 0.9; margin-top: 5px; }
    .ppt-list {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    .ppt-list h2 { color: #333; margin-bottom: 20px; font-size: 24px; }
    .ppt-item {
      display: flex;
      align-items: center;
      padding: 20px;
      border: 2px solid #f0f0f0;
      border-radius: 12px;
      margin-bottom: 15px;
      transition: all 0.3s;
    }
    .ppt-item:hover {
      border-color: #2971EB;
      box-shadow: 0 4px 12px rgba(41,113,235,0.15);
      transform: translateY(-2px);
    }
    .ppt-icon { font-size: 48px; margin-right: 20px; }
    .ppt-info { flex: 1; }
    .ppt-name { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 8px; }
    .ppt-meta { color: #999; font-size: 14px; }
    .ppt-meta span { margin-right: 20px; }
    .ppt-actions { display: flex; gap: 10px; }
    .btn-preview, .btn-download {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s;
    }
    .btn-preview { background: #2971EB; color: white; }
    .btn-preview:hover { background: #1e5fd9; transform: scale(1.05); }
    .btn-download { background: #05C8C8; color: white; }
    .btn-download:hover { background: #04a8a8; transform: scale(1.05); }
    .empty-state { text-align: center; padding: 60px 20px; color: #999; }
    .empty-state .icon { font-size: 80px; margin-bottom: 20px; }
    .footer { text-align: center; color: white; margin-top: 40px; opacity: 0.8; }
    .footer a { color: white; text-decoration: underline; }
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
      overflow: auto;
    }
    .modal.active { display: flex; align-items: center; justify-content: center; }
    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .modal-title { font-size: 24px; font-weight: bold; }
    .modal-close {
      font-size: 30px;
      cursor: pointer;
      color: #999;
      background: none;
      border: none;
    }
    .modal-close:hover { color: #333; }
    .preview-container {
      text-align: center;
      padding: 40px;
      background: #f5f5f5;
      border-radius: 12px;
    }
    .preview-note { color: #666; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🦐 Leon PPT 预览中心</h1>
      <p>自动生成的专业PPT，一键预览与下载</p>
      <div class="stats">
        <div class="stat-item">
          <div class="stat-number">${pptFiles.length}</div>
          <div class="stat-label">PPT文件</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">22</div>
          <div class="stat-label">版式模板</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">∞</div>
          <div class="stat-label">创意可能</div>
        </div>
      </div>
    </div>
    <div class="ppt-list">
      <h2>📁 PPT文件列表</h2>
      ${pptFiles.length > 0 ? fileList : `
        <div class="empty-state">
          <div class="icon">📭</div>
          <p>暂无PPT文件</p>
          <p style="margin-top: 10px; font-size: 14px;">使用 Leon PPT Skill 生成您的第一个演示文稿</p>
        </div>
      `}
    </div>
    <div class="footer">
      <p>🦐 由虾仔 (OpenClaw AI Assistant) 自动生成与维护</p>
      <p style="margin-top: 10px;">
        <a href="https://github.com/Leon-LiZZZ/leon-ppt" target="_blank">GitHub仓库</a> · 端口: ${PORT}
      </p>
    </div>
  </div>
  <div id="previewModal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-title" id="previewTitle">PPT预览</div>
        <button class="modal-close" onclick="closePreview()">&times;</button>
      </div>
      <div class="preview-container">
        <div style="font-size: 80px; margin-bottom: 20px;">📊</div>
        <p style="font-size: 18px; color: #333; margin-bottom: 10px;">PPT文件已生成</p>
        <p class="preview-note">提示：下载后使用 PowerPoint 或 Keynote 打开查看完整效果</p>
        <a id="previewDownload" class="btn-download" style="margin-top: 20px;" download>⬇️ 下载PPT文件</a>
      </div>
    </div>
  </div>
  <script>
    function previewPPT(filename) {
      document.getElementById('previewTitle').textContent = filename;
      document.getElementById('previewDownload').href = '/download/' + filename;
      document.getElementById('previewModal').classList.add('active');
    }
    function closePreview() {
      document.getElementById('previewModal').classList.remove('active');
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePreview();
    });
    document.getElementById('previewModal').addEventListener('click', (e) => {
      if (e.target.id === 'previewModal') closePreview();
    });
  </script>
</body>
</html>`;
}

// ─── 创建HTTP服务器 ───────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  log.info(`${req.method} ${pathname}`);
  
  // 首页
  if (pathname === '/' || pathname === '/index.html') {
    const html = generateHTML(getPPTFiles());
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }
  
  // API: 获取文件列表
  if (pathname === '/api/files') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(getPPTFiles(), null, 2));
    return;
  }
  
  // 下载文件
  if (pathname.startsWith('/download/')) {
    const filename = decodeURIComponent(pathname.substring('/download/'.length));
    const filepath = path.join(OUTPUT_DIR, filename);
    
    if (!fs.existsSync(filepath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('文件不存在');
      return;
    }
    
    const stat = fs.statSync(filepath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES['.pptx'],
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
    });
    
    const stream = fs.createReadStream(filepath);
    stream.pipe(res);
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

// ─── 启动服务器 ───────────────────────────────────────────────────
server.listen(PORT, HOST, () => {
  log.info(`🦐 Leon PPT 预览服务器已启动`);
  log.info(`📡 监听地址: http://${HOST}:${PORT}`);
  log.info(`📁 PPT目录: ${OUTPUT_DIR}`);
  log.info(`🌐 公网访问: http://<你的公网IP>:${PORT}`);
  log.info(`⏹️  按 Ctrl+C 停止服务器`);
});

// ─── 优雅退出 ───────────────────────────────────────────────────
process.on('SIGINT', () => {
  log.info('\n正在关闭服务器...');  server.close(() => {
    log.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  log.info('收到SIGTERM信号，正在关闭...');
  server.close(() => {
    log.info('服务器已关闭');
    process.exit(0);
  });
});
