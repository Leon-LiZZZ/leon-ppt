'use strict';
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// ─── Paths ───────────────────────────────────────────────────────
const SKILL_DIR = path.dirname(__dirname);
const ASSETS_DIR = path.join(SKILL_DIR, 'assets');
const OUTPUT_DIR = path.join(SKILL_DIR, 'output');

// ─── Global Font ──────────────────────────────────────────────────
const FONT = 'Microsoft YaHei';

// ─── Shadow Factory ───────────────────────────────────────────────
const mkSh  = () => ({ type:'outer', blur:8,  offset:3, angle:135, color:'000000', opacity:0.08 });
const mkShS = () => ({ type:'outer', blur:4,  offset:1, angle:135, color:'000000', opacity:0.05 });

// ─── Logo ────────────────────────────────────────────────────────
function addLogo(slide, logoData) {
  slide.addImage({
    data: logoData,
    x: 12.250, y: 0.187, w: 0.849, h: 0.433
  });
}

// ─── Footer ──────────────────────────────────────────────────────
function addFooter(slide, pageNum) {
  slide.addText('内部资料 请勿外传', {
    x: 11.355, y: 7.017, w: 1.327, h: 0.190,
    fontSize: 8, color: 'BFBFBF', fontFace: FONT, margin: 0
  });
  slide.addText(String(pageNum), {
    x: 12.845, y: 7.051, w: 0.384, h: 0.150,
    fontSize: 10, color: '2971EB',
    align: 'right', fontFace: FONT, margin: 0
  });
}

// ─── Content Title ────────────────────────────────────────────────
function addContentTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.435, y: 0.230, w: 10.601, h: 0.513,
    fontSize: 28, color: '373838', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.435, y: 0.747, w: 8.523, h: 0.312,
      fontSize: 14, color: 'BFBFBF',
      fontFace: FONT, margin: 0, valign: 'middle'
    });
  }
}

// ─── Color Sequence ───────────────────────────────────────────────
const COLOR_SEQ = ['2971EB', '22AAFE', '05C8C8', '966EFF', 'FFB61A'];

// ─── Main Function ────────────────────────────────────────────────
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = '演示文稿标题';
  pres.author = 'Leon PPT';

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let pg = 1;

  // ── Slide 1: Cover ──────────────────────────────────────────────
  const s1 = pres.addSlide();
  s1.background = { color: '2971EB' };

  s1.addText('演示文稿标题', {
    x: 0.917, y: 2.247, w: 11.500, h: 1.450,
    fontSize: 54, color: 'FFFFFF', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });

  s1.addText('副标题', {
    x: 0.917, y: 3.8, w: 8.0, h: 0.55,
    fontSize: 20, color: 'E7F1FF',
    fontFace: FONT, margin: 0
  });

  s1.addText('2026.04', {
    x: 0.911, y: 6.198, w: 3.008, h: 0.330,
    fontSize: 16, color: 'FFFFFF', fontFace: FONT, margin: 0
  });

  addFooter(s1, pg++);

  // ── Slide 2: TOC ────────────────────────────────────────────────
  const s2 = pres.addSlide();
  s2.background = { color: 'FFFFFF' };

  s2.addText('目  录', {
    x: 0.435, y: 0.230, w: 4.0, h: 0.513,
    fontSize: 24, color: '373838', bold: true, fontFace: FONT, margin: 0
  });

  const sections = [
    { num: '01', title: '第一章节', sub: '章节描述' },
    { num: '02', title: '第二章节', sub: '章节描述' },
    { num: '03', title: '第三章节', sub: '章节描述' },
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

  addFooter(s2, pg++);

  // ── Slide 3: Content ─────────────────────────────────────────────
  const s3 = pres.addSlide();
  s3.background = { color: 'FFFFFF' };
  addContentTitle(s3, '内容要点', '副标题说明');

  const points = [
    { text: '第一要点内容', bold: true, highlight: true },
    { text: '第二要点内容', bold: false, highlight: false },
    { text: '第三要点内容', bold: false, highlight: false },
  ];

  const items = points.map((p, i) => ({
    text: p.text,
    options: {
      bullet: true,
      breakLine: i < points.length - 1,
      fontSize: p.bold ? 16 : 14,
      color: p.highlight ? '2971EB' : '373838',
      bold: p.bold || false,
      fontFace: FONT,
      paraSpaceAfter: 16,
    }
  }));

  s3.addText(items, {
    x: 0.434, y: 1.503, w: 12.256, h: 5.3,
    valign: 'top', fontFace: FONT
  });

  addFooter(s3, pg++);

  // ── Slide 4: Closing ─────────────────────────────────────────────
  const s4 = pres.addSlide();
  s4.background = { color: '2971EB' };

  s4.addText('谢谢', {
    x: 0.794, y: 2.802, w: 11.745, h: 2.735,
    fontSize: 72, color: 'FFFFFF', bold: true,
    fontFace: FONT, align: 'center', valign: 'middle'
  });

  addFooter(s4, pg++);

  // ── Write File ──────────────────────────────────────────────────
  const outputPath = path.join(OUTPUT_DIR, 'output.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ output.pptx 已生成: ${outputPath}`);
  console.log(`✓ 共 ${pg - 1} 页`);
}

main().catch(e => { console.error(e); process.exit(1); });
