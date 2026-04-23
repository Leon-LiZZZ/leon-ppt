# Leon PPT 技术构建规范 v1.0

---

## 1. 构建脚本标准模板

```javascript
'use strict';
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const SKILL_DIR = '/home/lee/.claude/skills/leon-ppt';
const ASSETS_DIR = path.join(SKILL_DIR, 'assets');
const OUTPUT_DIR = path.join(SKILL_DIR, 'output');

const FONT = 'Microsoft YaHei';

// 资源加载
function loadAsset(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeMap = { jpeg:'image/jpeg', jpg:'image/jpeg', png:'image/png', gif:'image/gif' };
  return (mimeMap[ext]||'image/png') + ';base64,' + fs.readFileSync(path.join(ASSETS_DIR, filename)).toString('base64');
}

// Shadow 工厂
const mkSh  = () => ({ type:'outer', blur:8,  offset:3, angle:135, color:'000000', opacity:0.08 });
const mkShS = () => ({ type:'outer', blur:4,  offset:1, angle:135, color:'000000', opacity:0.05 });

// Logo
function addLogo(slide, logoData) {
  slide.addImage({ data: logoData, x: 12.250, y: 0.187, w: 0.849, h: 0.433 });
}

// 页脚
function addFooter(slide, pageNum) {
  slide.addText('内部资料 请勿外传', {
    x: 11.355, y: 7.017, w: 1.327, h: 0.190,
    fontSize: 8, color: 'BFBFBF', fontFace: FONT, margin: 0
  });
  slide.addText(String(pageNum), {
    x: 12.845, y: 7.051, w: 0.384, h: 0.150,
    fontSize: 10, color: '2971EB', align: 'right', fontFace: FONT, margin: 0
  });
}

// 主函数
async function main() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = '演示文稿标题';
  pres.author = 'Leon PPT';

  let pg = 1;
  // addCoverSlide(pres, { title:'...', date:'2026.04' }, pg++);
  // addTOCSlide(pres, [...], pg++);
  // addBulletSlide(pres, { title:'...', points:[...] }, pg++);
  // addClosingSlide(pres, pg++);

  const outputPath = path.join(OUTPUT_DIR, 'output.pptx');
  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ output.pptx（共 ${pg-1} 页）`);
}

main().catch(e => { console.error(e); process.exit(1); });
```

---

## 2. 执行命令

```bash
# 生成 PPTX
cd /home/lee/.claude/skills/leon-ppt && node scripts/build_pptx.js

# 输出位置
# output/output.pptx
```

---

## 3. 视觉 QA 清单

| 类别 | 检查项 |
|------|-------|
| Logo | 位置 x=12.250" y=0.187" |
| 页脚 | 页码右下角；内容页左下角有保密声明 |
| 封面 | 主标题居中，无 Logo |
| 目录 | 大号序号蓝色左对齐 |
| 内容页 | 标题无竖线；内容从 y=1.503" 开始 |
| 结尾页 | 致谢文字居中 |

---

## 4. 绝对禁止事项

```javascript
// ❌ Hex 色值加 # 号
color: "#2971EB"  →  color: "2971EB"

// ❌ 复用 shadow 对象
→ 每次调用工厂函数：mkShS() / mkSh()

// ❌ Unicode 项目符号（双重符号）
addText("• 要点")  →  addText([...], { bullet: true })

// ❌ 错误幻灯片尺寸
LAYOUT_16x9  →  LAYOUT_WIDE

// ❌ 连续 3 页以上用同一版式
→ 穿插不同版式保持视觉节奏
```

---

## 5. 交付规范

```
✅ 视觉 QA 通过
✅ 文件复制到 output/ 目录
✅ 交付说明：共 X 页，已通过视觉QA
```
