# Leon PPT 版式预设 v1.0

---

## 通用辅助函数

```javascript
'use strict';
const pptxgen = require('pptxgenjs');
const fs = require('fs');

const FONT = 'Microsoft YaHei';

// 资源加载
function loadAsset(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeMap = { jpeg:'image/jpeg', jpg:'image/jpeg', png:'image/png', gif:'image/gif' };
  return (mimeMap[ext]||'image/png') + ';base64,' + fs.readFileSync(`assets/${filename}`).toString('base64');
}

// Shadow 工厂
const mkSh  = () => ({ type:'outer', blur:8,  offset:3, angle:135, color:'000000', opacity:0.08 });
const mkShS = () => ({ type:'outer', blur:4,  offset:1, angle:135, color:'000000', opacity:0.05 });

// Logo
function addLogo(slide, logoData) {
  slide.addImage({
    data: logoData,
    x: 12.250, y: 0.187, w: 0.849, h: 0.433
  });
}

// 页脚
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

// 内容页标题
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

const COLOR_SEQ = ['2971EB', '22AAFE', '05C8C8', '966EFF', 'FFB61A'];
```

---

## 版式 01 — 封面页

```javascript
function addCoverSlide(pres, { title, subtitle, author, date }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: '2971EB' };

  s.addText(title, {
    x: 0.917, y: 2.247, w: 11.500, h: 1.450,
    fontSize: 54, color: 'FFFFFF', bold: true,
    fontFace: FONT, margin: 0, valign: 'middle'
  });

  if (subtitle) {
    s.addText(subtitle, {
      x: 0.917, y: 3.8, w: 8.0, h: 0.55,
      fontSize: 20, color: 'E7F1FF',
      fontFace: FONT, margin: 0
    });
  }

  if (author) {
    s.addText(author, {
      x: 0.917, y: 5.255, w: 3.008, h: 0.443,
      fontSize: 16, color: 'FFFFFF', fontFace: FONT, margin: 0
    });
  }

  if (date) {
    s.addText(date, {
      x: 0.911, y: 6.198, w: 3.008, h: 0.330,
      fontSize: 16, color: 'FFFFFF', fontFace: FONT, margin: 0
    });
  }

  addFooter(s, pageNum);
}
```

---

## 版式 02 — 目录页

```javascript
function addTOCSlide(pres, sections, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };

  s.addText('目  录', {
    x: 0.435, y: 0.230, w: 4.0, h: 0.513,
    fontSize: 24, color: '373838', bold: true, fontFace: FONT, margin: 0
  });

  const ROW_Y = [1.805, 3.073, 4.254, 5.421];

  sections.slice(0, 4).forEach((sec, i) => {
    const rowY = ROW_Y[i];

    s.addText(sec.num, {
      x: 0.429, y: rowY, w: 2.400, h: 0.908,
      fontSize: 80, color: '2971EB', bold: true, fontFace: FONT, margin: 0
    });

    s.addText(sec.title, {
      x: 3.050, y: rowY + 0.04, w: 7.650, h: 0.449,
      fontSize: 20, color: '373838', bold: true, fontFace: FONT, margin: 0
    });

    if (sec.sub) {
      s.addText(sec.sub, {
        x: 3.050, y: rowY + 0.50, w: 7.650, h: 0.312,
        fontSize: 13, color: 'BFBFBF', fontFace: FONT, margin: 0
      });
    }
  });

  addFooter(s, pageNum);
}
```

---

## 版式 03 — 章节分隔页

```javascript
function addSectionSlide(pres, { num, title, subtitle }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: '2971EB' };

  s.addText(num, {
    x: 0.403, y: 0.284, w: 2.365, h: 2.205,
    fontSize: 125, color: '00CCFE', bold: true, fontFace: FONT, margin: 0
  });

  s.addText(title, {
    x: 0.516, y: 2.970, w: 10.870, h: 0.667,
    fontSize: 24, color: 'FFFFFF', bold: true, fontFace: FONT, margin: 0
  });

  if (subtitle) {
    s.addText(subtitle, {
      x: 0.516, y: 3.626, w: 5.167, h: 1.320,
      fontSize: 16, color: 'FFFFFF', fontFace: FONT, margin: 0
    });
  }

  addFooter(s, pageNum);
}
```

---

## 版式 04 — 要点列表

```javascript
function addBulletSlide(pres, { title, subtitle, points }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

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

  s.addText(items, {
    x: 0.434, y: 1.503, w: 12.256, h: 5.3,
    valign: 'top', fontFace: FONT
  });

  addFooter(s, pageNum);
}
```

---

## 版式 05 — 数据卡片

```javascript
function addDataCardSlide(pres, { title, subtitle, cards }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

  const n = cards.length;
  const cW = (12.256 - (n-1)*0.24) / n;
  const cY = 1.60, cH = 5.20, sX = 0.434;

  cards.forEach((c, i) => {
    const x = sX + i * (cW + 0.24);
    const col = c.color || COLOR_SEQ[i % COLOR_SEQ.length];

    s.addShape(pres.ShapeType.roundRect, {
      x, y: cY, w: cW, h: cH,
      fill: { color: 'E7F1FF' }, rectRadius: 0.15, shadow: mkShS()
    });

    s.addShape(pres.ShapeType.rect, {
      x, y: cY, w: cW, h: 0.55, fill: { color: col }
    });

    s.addText(c.label || '', {
      x, y: cY, w: cW, h: 0.55,
      fontSize: 15, color: 'FFFFFF', bold: true,
      fontFace: FONT, align: 'center', margin: 0
    });

    s.addText((c.num || '') + (c.unit ? ' ' + c.unit : ''), {
      x, y: cY + 0.70, w: cW, h: 1.50,
      fontSize: 60, color: col, bold: true,
      fontFace: FONT, align: 'center', margin: 0
    });

    if (c.sub) {
      s.addText(c.sub, {
        x: x + 0.12, y: cY + 2.30, w: cW - 0.24, h: 2.8,
        fontSize: 14, color: '373838', fontFace: FONT, valign: 'top', margin: 0
      });
    }
  });

  addFooter(s, pageNum);
}
```

---

## 版式 06 — 对比栏

```javascript
function addCompareSlide(pres, { title, subtitle, left, right, dividerLabel }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

  const MARGIN = 0.50;
  const GAP = 0.28;
  const TOTAL_W = 13.333 - MARGIN * 2;
  const COL_W = (TOTAL_W - GAP) / 2;
  const START_Y = 1.60;
  const HEADER_H = 0.60;
  const BODY_H = 5.00;

  const lX = MARGIN;
  const rX = MARGIN + COL_W + GAP;

  // 左侧
  const lCol = left.headerColor || '28245F';
  s.addShape(pres.ShapeType.rect, { x: lX, y: START_Y, w: COL_W, h: HEADER_H, fill: { color: lCol } });
  s.addText(left.header, { x: lX + 0.20, y: START_Y, w: COL_W - 0.40, h: HEADER_H, fontSize: 18, bold: true, color: 'FFFFFF', fontFace: FONT, valign: 'middle' });

  s.addShape(pres.ShapeType.roundRect, { x: lX, y: START_Y + HEADER_H, w: COL_W, h: BODY_H, fill: { color: 'E7F1FF' }, rectRadius: 0.15, shadow: mkShS() });

  // 右侧
  const rCol = right.headerColor || '2971EB';
  s.addShape(pres.ShapeType.rect, { x: rX, y: START_Y, w: COL_W, h: HEADER_H, fill: { color: rCol } });
  s.addText(right.header, { x: rX + 0.20, y: START_Y, w: COL_W - 0.40, h: HEADER_H, fontSize: 18, bold: true, color: 'FFFFFF', fontFace: FONT, valign: 'middle' });

  s.addShape(pres.ShapeType.roundRect, { x: rX, y: START_Y + HEADER_H, w: COL_W, h: BODY_H, fill: { color: 'E7F1FF' }, rectRadius: 0.15, shadow: mkShS() });

  // 要点
  [left, right].forEach((col, idx) => {
    const cx = idx === 0 ? lX : rX;
    if (col.points && col.points.length) {
      const items = col.points.map((p, i) => ({
        text: p,
        options: { bullet: true, breakLine: i < col.points.length - 1, fontSize: 15, color: '373838', fontFace: FONT, paraSpaceAfter: 12 }
      }));
      s.addText(items, { x: cx + 0.22, y: START_Y + HEADER_H + 0.20, w: COL_W - 0.44, h: BODY_H - 0.30, valign: 'top' });
    }
  });

  addFooter(s, pageNum);
}
```

---

## 版式 07 — 结尾页

```javascript
function addClosingSlide(pres, pageNum) {
  const s = pres.addSlide();
  s.background = { color: '2971EB' };

  s.addText('谢谢', {
    x: 0.794, y: 2.802, w: 7.562, h: 2.735,
    fontSize: 72, color: 'FFFFFF', bold: true,
    fontFace: FONT, align: 'center', valign: 'middle'
  });

  addFooter(s, pageNum);
}
```

---

## 版式 08 — PDCA 循环

```javascript
function addPDCASlide(pres, { title, subtitle, pdca }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

  const GX = 0.434, GY = 1.48, GW = 12.256, GH = 5.72;
  const GAP = 0.14;
  const cW = (GW - GAP) / 2;
  const cH = (GH - GAP) / 2;

  const CELLS = [
    { key: 'P', label: 'P  计划 Plan', color: '2971EB', data: pdca.P },
    { key: 'D', label: 'D  执行 Do', color: '22AAFE', data: pdca.D },
    { key: 'A', label: 'A  改进 Act', color: '966EFF', data: pdca.A },
    { key: 'C', label: 'C  检查 Check', color: 'FFB61A', data: pdca.C },
  ];
  const COORDS = [[0,0],[1,0],[0,1],[1,1]];

  CELLS.forEach((cell, i) => {
    const [col, row] = COORDS[i];
    const cx = GX + col * (cW + GAP);
    const cy = GY + row * (cH + GAP);

    s.addShape(pres.ShapeType.rect, {
      x: cx, y: cy, w: cW, h: cH,
      fill: { color: cell.color }, shadow: mkSh()
    });

    s.addText(cell.label, {
      x: cx + 0.20, y: cy + 0.22, w: cW - 0.30, h: 0.46,
      fontSize: 15, bold: true, color: 'FFFFFF', fontFace: FONT
    });

    const pts = (cell.data?.points || []).slice(0, 4);
    if (pts.length) {
      const items = pts.map((pt, j) => ({
        text: pt,
        options: { breakLine: j < pts.length - 1, fontSize: 13, color: 'E7F1FF', fontFace: FONT, paraSpaceAfter: 12, bullet: { type: 'char', code: '25B8', color: 'FFFFFF', size: 70 } }
      }));
      s.addText(items, { x: cx + 0.22, y: cy + 0.80, w: cW - 0.40, h: cH - 0.98, valign: 'top' });
    }
  });

  addFooter(s, pageNum);
}
```

---

## 版式 09 — SWOT 矩阵

```javascript
function addSWOTSlide(pres, { title, subtitle, swot }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

  const GX = 0.434, GY = 1.48, GW = 12.256, GH = 5.72;
  const GAP = 0.12;
  const cW = (GW - GAP) / 2;
  const cH = (GH - GAP) / 2;

  const CELLS = [
    { key: 'S', label: 'S  优势 Strengths', headerColor: '2971EB', data: swot.S },
    { key: 'O', label: 'O  机会 Opportunities', headerColor: '05C8C8', data: swot.O },
    { key: 'W', label: 'W  劣势 Weaknesses', headerColor: 'E7F1FF', data: swot.W },
    { key: 'T', label: 'T  威胁 Threats', headerColor: '966EFF', data: swot.T },
  ];
  const COORDS = [[0,0],[1,0],[0,1],[1,1]];

  CELLS.forEach((cell, i) => {
    const [col, row] = COORDS[i];
    const cx = GX + col * (cW + GAP);
    const cy = GY + row * (cH + GAP);
    const hH = 0.50;

    s.addShape(pres.ShapeType.rect, { x: cx, y: cy, w: cW, h: hH, fill: { color: cell.headerColor } });
    s.addText(cell.label, { x: cx + 0.20, y: cy, w: cW - 0.30, h: hH, fontSize: 15, bold: true, color: cell.headerColor === 'E7F1FF' ? '373838' : 'FFFFFF', fontFace: FONT, valign: 'middle' });

    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy + hH, w: cW, h: cH - hH, fill: { color: 'E7F1FF' }, rectRadius: 0.12, shadow: mkShS() });

    const pts = (cell.data?.points || []).slice(0, 4);
    if (pts.length) {
      const items = pts.map((pt, j) => ({
        text: pt, options: { breakLine: j < pts.length - 1, fontSize: 13, color: '373838', fontFace: FONT, paraSpaceAfter: 14, bullet: { type: 'char', code: '25CF', color: cell.headerColor === 'E7F1FF' ? '2971EB' : cell.headerColor, size: 55 } }
      }));
      s.addText(items, { x: cx + 0.22, y: cy + hH + 0.16, w: cW - 0.38, h: cH - hH - 0.24, valign: 'top' });
    }
  });

  addFooter(s, pageNum);
}
```

---

## 版式 10 — Bento Grid

```javascript
function addBentoGrid(pres, { title, subtitle, cards }, pageNum) {
  const s = pres.addSlide();
  s.background = { color: 'FFFFFF' };
  addContentTitle(s, title, subtitle);

  const GAP = 0.12;
  const sX = 0.434, sY = 1.55;
  const totalW = 12.256, totalH = 5.20;

  const primaryW = totalW * 0.46;
  const secondW = totalW - primaryW - GAP;
  const secColW = (secondW - GAP) / 2;
  const secRowH = (totalH - GAP) / 2;

  // 主卡
  const primary = cards[0] || {};
  s.addShape(pres.ShapeType.roundRect, { x: sX, y: sY, w: primaryW, h: totalH, fill: { color: '2971EB' }, rectRadius: 0.15, shadow: mkSh() });
  if (primary.title) {
    s.addText(primary.title, { x: sX + 0.20, y: sY + 0.20, w: primaryW - 0.40, h: 0.50, fontSize: 18, bold: true, color: 'FFFFFF', fontFace: FONT });
  }
  if (primary.body) {
    s.addText(primary.body, { x: sX + 0.20, y: sY + 0.80, w: primaryW - 0.40, h: totalH - 1.0, fontSize: 14, color: 'E7F1FF', fontFace: FONT, valign: 'top' });
  }

  // 次卡
  const secondaries = cards.slice(1, 5);
  secondaries.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = sX + primaryW + GAP + col * (secColW + GAP);
    const cy = sY + row * (secRowH + GAP);

    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy, w: secColW, h: secRowH, fill: { color: 'E7F1FF' }, rectRadius: 0.12, shadow: mkShS() });
    if (c.title) {
      s.addText(c.title, { x: cx + 0.15, y: cy + 0.15, w: secColW - 0.30, h: 0.40, fontSize: 14, bold: true, color: '2971EB', fontFace: FONT });
    }
    if (c.body) {
      s.addText(c.body, { x: cx + 0.15, y: cy + 0.60, w: secColW - 0.30, h: secRowH - 0.75, fontSize: 12, color: '373838', fontFace: FONT, valign: 'top' });
    }
  });

  addFooter(s, pageNum);
}
```
