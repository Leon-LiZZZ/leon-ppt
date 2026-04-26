#!/usr/bin/env node
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { exec } = require('child_process');

const PORT = 18880;
const AUTH_TOKEN = 'leon2026';
const OUTPUT_DIR = path.join(path.dirname(__dirname), 'output');
const PREVIEW_DIR = path.join(path.dirname(__dirname), 'previews');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(PREVIEW_DIR)) fs.mkdirSync(PREVIEW_DIR, { recursive: true });

function getPPTFiles() {
  return fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.pptx')).map(f => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f));
    return { name: f, size: (stat.size/1024).toFixed(2)+' KB', time: stat.mtime.toISOString().substring(0,19).replace('T',' ') };
  }).sort((a,b) => b.time.localeCompare(a.time));
}

function createPreview(filename) {
  const uuid = crypto.randomUUID();
  const src = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(src)) return null;
  const previewPath = path.join(PREVIEW_DIR, uuid);
  fs.mkdirSync(previewPath, { recursive: true });
  fs.copyFileSync(src, path.join(previewPath, filename));
  const previewsFile = path.join(PREVIEW_DIR, 'index.json');
  const previews = fs.existsSync(previewsFile) ? JSON.parse(fs.readFileSync(previewsFile)) : {};
  previews[uuid] = { filename, createdAt: new Date().toISOString(), views: 0 };
  fs.writeFileSync(previewsFile, JSON.stringify(previews, null, 2));
  return { uuid, url: '/preview/'+uuid, ...previews[uuid] };
}

function getPreview(uuid) {
  const previewsFile = path.join(PREVIEW_DIR, 'index.json');
  if (!fs.existsSync(previewsFile)) return null;
  const previews = JSON.parse(fs.readFileSync(previewsFile));
  return previews[uuid] || null;
}

function convertToPDF(pptPath, pdfPath) {
  return new Promise((resolve, reject) => {
    const cmd = 'libreoffice --headless --convert-to pdf --outdir "'+path.dirname(pdfPath)+'" "'+pptPath+'"';
    exec(cmd, { timeout: 30000 }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function handlePreview(uuid, preview, res) {
  const pptPath = path.join(PREVIEW_DIR, uuid, preview.filename);
  const pdfPath = path.join(PREVIEW_DIR, uuid, preview.filename.replace('.pptx', '.pdf'));
  
  if (!fs.existsSync(pdfPath)) {
    try {
      await convertToPDF(pptPath, pdfPath);
    } catch (e) {
      console.error('PDF转换失败:', e);
    }
  }
  
  const hasPDF = fs.existsSync(pdfPath);
  const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>PPT预览</title></head><body style="margin:0;font-family:Microsoft YaHei;">'+
    '<div style="background:#2971EB;color:white;padding:15px;display:flex;justify-content:space-between;">'+
    '<div><h1 style="font-size:20px;margin:0;">📊 '+preview.filename+'</h1></div>'+
    '<div>'+(hasPDF?'<a href="/preview/'+uuid+'/pdf" style="color:white;margin-right:10px;">📄 PDF</a>':'')+
    '<a href="/preview/'+uuid+'/download" style="color:white;">⬇️ 下载</a></div></div>'+
    '<div style="height:calc(100vh - 60px);">'+
    (hasPDF ? '<embed src="/preview/'+uuid+'/pdf" style="width:100%;height:100%;"></embed>' : 
    '<div style="text-align:center;padding:100px;"><h2>PDF转换中...</h2><p>请稍后刷新页面</p></div>')+
    '</div></body></html>';
  
  res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
  res.end(html);
}

function checkAuth(req) {
  const cookies = req.headers.cookie || '';
  return cookies.includes('auth=' + AUTH_TOKEN);
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);
  console.log('[INFO]', req.method, pathname);
  
  if (pathname.startsWith('/preview/') && !pathname.includes('/download') && !pathname.includes('/pdf')) {
    const uuid = pathname.substring('/preview/'.length);
    const preview = getPreview(uuid);
    if (!preview) { res.writeHead(404); res.end('Not found'); return; }
    await handlePreview(uuid, preview, res);
    return;
  }
  
  if (pathname.includes('/pdf')) {
    const parts = pathname.split('/');
    const uuid = parts[2];
    const preview = getPreview(uuid);
    if (!preview) { res.writeHead(404); res.end('Not found'); return; }
    const pdfPath = path.join(PREVIEW_DIR, uuid, preview.filename.replace('.pptx', '.pdf'));
    if (!fs.existsSync(pdfPath)) { res.writeHead(404); res.end('PDF not found'); return; }
    res.writeHead(200, {'Content-Type': 'application/pdf'});
    fs.createReadStream(pdfPath).pipe(res);
    return;
  }
  
  if (pathname.startsWith('/preview/') && pathname.includes('/download')) {
    const parts = pathname.split('/');
    const uuid = parts[2];
    const preview = getPreview(uuid);
    if (!preview) { res.writeHead(404); res.end('Not found'); return; }
    const filepath = path.join(PREVIEW_DIR, uuid, preview.filename);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': 'attachment; filename*=UTF-8\'\''+encodeURIComponent(preview.filename)
    });
    fs.createReadStream(filepath).pipe(res);
    return;
  }
  
  if (pathname === '/api/files') {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(getPPTFiles()));
    return;
  }
  
  if (pathname.startsWith('/api/preview/')) {
    const filename = pathname.substring('/api/preview/'.length);
    const preview = createPreview(filename);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(preview || {error:'file not found'}));
    return;
  }
  
  if (!checkAuth(req)) {
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>登录</title></head><body style="background:#667eea;display:flex;align-items:center;justify-content:center;height:100vh;font-family:Microsoft YaHei;">'+
      '<div style="background:white;padding:40px;border-radius:20px;text-align:center;">'+
      '<div style="font-size:80px;">🔐</div><h2>Leon PPT预览中心</h2>'+
      '<form onsubmit="var p=document.getElementById(\'pwd\').value;if(p===\'leon2026\'){document.cookie=\'auth=leon2026;path=/;max-age=86400\';location=\'/\';}else{alert(\'密码错误\');}return false;">'+
      '<input id="pwd" type="password" placeholder="密码" style="padding:15px;width:200px;margin:20px 0;border-radius:8px;border:2px solid #e0e0e0;">'+
      '<button style="padding:15px 30px;background:#2971EB;color:white;border:none;border-radius:8px;width:100%;">登录</button></form></div></body></html>');
    return;
  }
  
  if (pathname === '/') {
    const files = getPPTFiles();
    const list = files.map(f => '<div style="padding:20px;border:2px solid #f0f0f0;border-radius:12px;margin:15px 0;display:flex;align-items:center;">'+
      '<div style="font-size:48px;margin-right:20px;">📊</div>'+
      '<div style="flex:1;"><div style="font-size:18px;font-weight:bold;">'+f.name+'</div>'+
      '<div style="color:#999;font-size:14px;">'+f.size+' | '+f.time+'</div></div>'+
      '<button onclick="fetch(\'/api/preview/'+encodeURIComponent(f.name)+'\').then(r=>r.json()).then(d=>{var i=document.createElement(\'input\');i.value=location.origin+d.url;document.body.appendChild(i);i.select();document.execCommand(\'copy\');document.body.removeChild(i);alert(\'链接已复制\');})" style="padding:10px 20px;background:#2971EB;color:white;border:none;border-radius:8px;cursor:pointer;">🔗 生成预览</button>'+
      '</div>').join('');
    
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.end('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Leon PPT预览中心</title></head><body style="background:linear-gradient(135deg,#667eea,#764ba2);font-family:Microsoft YaHei;padding:20px;">'+
      '<div style="max-width:1200px;margin:0 auto;">'+
      '<div style="text-align:center;color:white;margin-bottom:40px;">'+
      '<h1 style="font-size:48px;">🦐 Leon PPT预览中心</h1><p style="font-size:18px;">PPT自动转PDF在线预览</p></div>'+
      '<div style="background:white;border-radius:20px;padding:30px;">'+
      '<h2 style="margin-bottom:20px;">📁 PPT文件列表</h2>'+
      (files.length > 0 ? list : '<div style="text-align:center;padding:60px;color:#999;">暂无文件</div>')+
      '</div></div></body></html>');
    return;
  }
  
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('[INFO] 🦐 Leon PPT预览服务已启动 (LibreOffice版)');
  console.log('[INFO] 端口: '+PORT);
  console.log('[INFO] 访问: http://8.134.145.103:'+PORT);
  console.log('[INFO] 密码: '+AUTH_TOKEN);
});
