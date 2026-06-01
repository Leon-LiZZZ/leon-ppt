# Leon PPT (PPT Master)

> AI 驱动的多格式 SVG 内容生成系统 — 将源文档（PDF/DOCX/URL/Markdown）通过多角色协作转化为高质量 SVG 页面并导出为 PPTX。

**核心管线**: `源文档 → 创建项目 → [模板] → 策略师 → [图片生成] → 执行器实时预览 → 质量检查 → 后处理 → 导出`

---

## 功能特性

| 能力 | 说明 |
|------|------|
| 📄 **多源输入** | 支持 PDF、Word、Excel、PowerPoint、网页 URL、Markdown 等多种格式 |
| 🎨 **AI 配图** | 集成 OpenAI / Gemini / Qwen / 智谱 / 火山引擎 等多模型图片生成 |
| 🖼️ **布局模板** | 内置学术答辩、咨询报告、政务、医疗、复古像素等多种主题 |
| 📊 **可视化图表** | 框架图、流程图、时间线、漏斗图、信息图等 SVG 图表模板 |
| 🎤 **旁白音频** | AI 语音合成（edge-tts / ElevenLabs / MiniMax 等） |
| ✨ **动效配置** | 支持 PPTX 对象级动画定制 |
| ✅ **质量检查** | 自动化 SVG 合规校验，确保 PPTX 兼容性 |
| 📦 **一键导出** | SVG → PPTX 批量转换，Office 兼容模式 |

## 目录结构

```
leon-ppt/
├── SKILL.md                        # 技能主控文档（管线定义 + 执行规则）
├── requirements.txt                # Python 依赖
├── .env.example                    # 环境变量配置示例
│
├── scripts/                        # Python 工具脚本
│   ├── source_to_md/               # 源文档 → Markdown 转换器
│   │   ├── pdf_to_md.py            #   PDF 转 Markdown
│   │   ├── doc_to_md.py            #   Word/DOCX/HTML/EPUB/IPYNB 转 Markdown
│   │   ├── excel_to_md.py          #   Excel 转 Markdown
│   │   ├── ppt_to_md.py            #   PowerPoint 转 Markdown
│   │   └── web_to_md.py            #   网页抓取（支持微信公众号）
│   ├── project_manager.py          #   项目创建/验证/管理
│   ├── image_gen.py                #   AI 图片生成（多后端）
│   ├── svg_quality_checker.py      #   SVG 质量校验
│   ├── finalize_svg.py             #   SVG 后处理（统一入口）
│   ├── svg_to_pptx.py              #   SVG → PPTX 导出
│   ├── notes_to_audio.py           #   旁白音频生成
│   ├── latex_render.py             #   LaTeX 公式渲染
│   ├── animation_config.py         #   动画配置
│   └── docs/                       #   脚本使用文档
│
├── templates/                      # 模板资源
│   ├── layouts/                    #   页面布局模板（含 layout SVG + design spec）
│   ├── brands/                     #   品牌标识预设（色彩/字体/Logo/语调）
│   ├── decks/                      #   完整成品套版
│   ├── charts/                     #   可视化图表 SVG 模板
│   ├── icons/                      #   图标库（Tabler Outline 6000+ SVG 图标）
│   ├── design_spec_reference.md    #   设计规范参考模板
│   └── spec_lock_reference.md      #   spec_lock 技术约束参考
│
├── references/                     # 设计参考文档
│   ├── strategist.md               #   策略师角色指南
│   ├── executor-base.md            #   执行器基础规范
│   ├── image-generator.md          #   图片生成指南
│   ├── image-palettes/             #   配色方案库
│   ├── image-renderings/           #   渲染风格指南
│   └── shared-standards.md         #   跨角色通用标准
│
├── workflows/                      # 独立工作流
│   ├── topic-research.md           #   话题调研（无源文档时使用）
│   ├── create-template.md          #   创建布局模板
│   ├── create-brand.md             #   创建品牌预设
│   ├── resume-execute.md           #   会话分割恢复执行
│   ├── verify-charts.md            #   图表坐标校准
│   ├── customize-animations.md     #   动画定制
│   ├── live-preview.md             #   浏览器实时预览
│   └── visual-review.md            #   视觉自检
│
└── .gitignore
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置图片生成（可选）

复制 `.env.example` 为 `.env`，按需配置 AI 图片生成后端（至少配置一个）：

```bash
# OpenAI
IMAGE_BACKEND=openai
OPENAI_API_KEY=sk-xxx

# 或 Gemini
IMAGE_BACKEND=gemini
GEMINI_API_KEY=your-key
```

### 3. 转换源文档

```bash
python scripts/source_to_md/pdf_to_md.py 文档.pdf
python scripts/source_to_md/web_to_md.py https://example.com
```

### 4. 创建项目

```bash
python scripts/project_manager.py init 我的演示 --format ppt169
```

### 5. 生成 PPT

按照 `SKILL.md` 定义的管线流程，通过 AI 多角色协作逐步完成：
**策略师 → 执行器（SVG 生成）→ 质量检查 → 后处理 → 导出 PPTX**

## 核心管线流程

| 步骤 | 角色 | 产出物 |
|------|------|--------|
| Step 1 | 源内容处理 | Markdown 格式源内容 |
| Step 2 | 创建项目 | 项目目录 + sources 目录 |
| Step 3 | 模板选择（可跳过） | 布局/品牌/图表模板索引 |
| Step 4 | 策略师 ⛔ BLOCKING | `design_spec.md` + `spec_lock.md` |
| Step 5 | 图片生成（可选） | AI 生成配图 |
| Step 6 | 执行器 | 逐页 SVG 文件 |
| Step 7 | 质量检查 | 校验报告 |
| Step 8 | 后处理 | 优化后的 SVG |
| Step 9 | 导出 PPTX | `.pptx` 文件 |

## 技术栈

- **Python** — 核心转换、图像生成、PPTX 导出
- **SVG** — 页面渲染格式（手写，逐页创作）
- **python-pptx** — PPTX 导出
- **多模型 AI** — OpenAI / Gemini / Qwen / 智谱 等图片生成
- **Edge-TTS / ElevenLabs** — 旁白语音合成

---

> **注意**: 本仓库是 Qoder Agent Skill，设计为与 AI 编码助手配合使用的技能定义。核心逻辑在 `SKILL.md` 中定义，AI 会遵循其中描述的严格管线规则逐步执行。
