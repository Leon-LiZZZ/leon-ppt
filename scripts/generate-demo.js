#!/usr/bin/env node
'use strict';

const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.dirname(__dirname);
const OUTPUT_DIR = path.join(SKILL_DIR, 'output');
const FONT = 'Microsoft YaHei';

async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Leon PPT 测试演示';
  pres.author = '虾仔 (OpenClaw AI Assistant)';

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let pg = 1;

  // 第1页：封面
  const s1 = pres.addSlide();
  s1.background = { color: '2971EB' };
  
  s1.addText('Leon PPT 功能演示', {
    x: 0.917, y: 2.247, w: 11.500, h: 1.450,
    fontSize: 54, color: 'FFFFFF', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  
  s1.addText('网页预览与下载功能测试', {
    x: 0.917, y: 3.8, w: 8.0, h: 0.55,
    fontSize: 20, color: 'E7F1FF',
    fontFace: FONT, margin: 0
  });
  
  s1.addText('2026.04.26', {
    x: 0.911, y: 6.198, w: 3.008, h: 0.330,
    fontSize: 16, color: 'FFFFFF', fontFace: FONT, margin: 0
  });
  
  s1.addText('🦐 虾仔制作', {
    x: 10.5, y: 6.198, w: 2.5, h: 0.330,
    fontSize: 12, color: 'E7F1FF', fontFace: FONT, margin: 0, align: 'right'
  });

  // 第2页：目录
  const s2 = pres.addSlide();
  s2.background = { color: 'FFFFFF' };
  
  s2.addText('目  录', {
    x: 0.435, y: 0.230, w: 4.0, h: 0.513,
    fontSize: 24, color: '373838', bold: true, fontFace: FONT, margin: 0
  });
  
  const sections = [
    { num: '01', title: '功能介绍', sub: '网页预览与下载' },
    { num: '02', title: '技术实现', sub: 'Node.js + PptxGenJS' },
    { num: '03', title: '使用演示', sub: '一键生成与分享' },
  ];
  
  const ROW_Y = [1.805, 3.073, 4.254];
  
  sections.forEach((sec, i) => {
    const rowY = ROW_Y[i];
    
    s2.addText(sec.num, {
      x: 0.429, y: rowY, w: 2.400, h: 0.908,
      fontSize: 80, color: '2971EB', bold: true, fontFace: FONT, margin: 0
    });
    
    s2.addText(sec.title, {
      x: 3.050, y: rowY + 0.04, w: 7.650, h: 0.449,
      fontSize: 20, color: '373838', bold: true, fontFace: FONT, margin: 0
    });
    
    s2.addText(sec.sub, {
      x: 3.050, y: rowY + 0.50, w: 7.650, h: 0.312,
      fontSize: 13, color: 'BFBFBF', fontFace: FONT, margin: 0
    });
  });

  // 第3页：功能介绍
  const s3 = pres.addSlide();
  s3.background = { color: 'FFFFFF' };
  
  s3.addText('功能介绍', {
    x: 0.435, y: 0.230, w: 10.601, h: 0.513,
    fontSize: 28, color: '373838', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  
  s3.addText('网页预览与下载功能', {
    x: 0.435, y: 0.747, w: 8.523, h: 0.312,
    fontSize: 14, color: 'BFBFBF',
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  
  const features = [
    { text: '✅ 自动生成专业PPT', color: '05C8C8' },
    { text: '✅ 网页预览界面', color: '22AAFE' },
    { text: '✅ 一键下载源文件', color: '966EFF' },
    { text: '✅ 响应式设计', color: 'FFB61A' },
    { text: '✅ RESTful API接口', color: '2971EB' },
  ];
  
  features.forEach((feat, i) => {
    s3.addText(feat.text, {
      x: 0.434, y: 1.503 + i * 0.8, w: 12.256, h: 0.6,
      fontSize: 18, color: feat.color, fontFace: FONT, margin: 0, bold: true
    });
  });

  // 第4页：技术架构
  const s4 = pres.addSlide();
  s4.background = { color: 'FFFFFF' };
  
  s4.addText('技术架构', {
    x: 0.435, y: 0.230, w: 10.601, h: 0.513,
    fontSize: 28, color: '373838', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  
  s4.addText('纯Node.js实现，无额外依赖', {
    x: 0.435, y: 0.747, w: 8.523, h: 0.312,
    fontSize: 14, color: 'BFBFBF',
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  
  // 技术栈卡片
  const techStack = [
    { title: 'PptxGenJS', desc: 'PPT生成引擎', color: '2971EB' },
    { title: 'HTTP Server', desc: '预览服务器', color: '22AAFE' },
    { title: 'RESTful API', desc: '文件管理接口', color: '05C8C8' },
  ];
  
  techStack.forEach((tech, i) => {
    const x = 0.5 + i * 4.2;
    
    s4.addShape('rect', {
      x: x, y: 1.8, w: 3.8, h: 2.5,
      fill: { color: tech.color },
      shadow: { type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.15 }
    });
    
    s4.addText(tech.title, {
      x: x + 0.2, y: 2.2, w: 3.4, h: 0.8,
      fontSize: 22, color: 'FFFFFF', bold: true, fontFace: FONT, margin: 0
    });
    
    s4.addText(tech.desc, {
      x: x + 0.2, y: 3.2, w: 3.4, h: 0.6,
      fontSize: 14, color: 'E7F1FF', fontFace: FONT, margin: 0
    });
  });
  
  s4.addText('🦐 由虾仔 (OpenClaw AI Assistant) 自动生成', {
    x: 0.5, y: 5.5, w: 12.5, h: 0.5,
    fontSize: 12, color: '999999', fontFace: FONT, margin: 0, align: 'center'
  });

  // 第5页：结尾
  const s5 = pres.addSlide();
  s5.background = { color: '2971EB' };
  
  s5.addText('谢谢观看', {
    x: 0.794, y: 2.802, w: 11.745, h: 2.735,
    fontSize: 72, color: 'FFFFFF', bold: true,
    fontFace: FONT, align: 'center', valign: 'middle'
  });
  
  s5.addText('🦐 Leon PPT - 让演示更简单', {
    x: 0.794, y: 5.0, w: 11.745, h: 0.5,
    fontSize: 16, color: 'E7F1FF',
    fontFace: FONT, align: 'center', margin: 0
  });
  
  s5.addText('访问地址: http://8.134.145.103:18880', {
    x: 0.794, y: 5.6, w: 11.745, h: 0.4,
    fontSize: 14, color: 'FFFFFF',
    fontFace: FONT, align: 'center', margin: 0
  });

  // 写入文件
  const outputPath = path.join(OUTPUT_DIR, 'leon-ppt-demo.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ leon-ppt-demo.pptx 已生成: ${outputPath}`);
  console.log(`✓ 共 5 页`);
}

main().catch(e => { console.error(e); process.exit(1); });
