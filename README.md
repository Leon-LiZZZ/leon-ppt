# Leon PPT 生成 Skill

将文字、大纲、文档一键转换为专业风格 `.pptx` 幻灯片

---

## 核心能力

| 能力 | 说明 |
|------|------|
| 🎨 **专业设计** | 品牌色 `#2971EB` · 字体 `Microsoft YaHei` |
| 🧠 **思维模型识别** | 自动识别 PDCA、SWOT、黄金圈、5W1H、SCQA 等框架 |
| 📐 **22 种版式** | 封面、目录、章节页、数据卡片、对比栏、Bento Grid…… |
| 🤖 **AI 品牌 Logo** | 自动识别 AI 品牌，嵌入 lobe-icons |
| 📄 **多格式输入** | Markdown · 文本大纲 · 直接粘贴内容 |

---

## 安装方法

```bash
# 进入 Claude Code 的 skills 目录
cd ~/.claude/skills/

# 克隆仓库
git clone <repo-url> leon-ppt

# 安装依赖
cd leon-ppt
npm install

# 重启 Claude Code 即可生效
```

---

## 使用示例

```
帮我把以下内容做成PPT：

## 2025 年度总结
- 营收增长 35%
- 用户数突破 100 万
- 新增 3 条产品线

## 下一步计划
- Q2 启动国际化
- 引入 AI 能力
```

---

## 支持版式

**基础版式：** 封面页、目录页、章节分隔页、要点列表、数据卡片、对比栏、时间轴、结尾页

**数据展示：** 数据看板、Bento Grid、悬浮统计

**思维模型：** 金字塔/MECE、PDCA循环、SWOT矩阵、黄金圈、5W1H、SCQA、IPD五看

---

## 品牌色规范

| 颜色 | 色值 | 用途 |
|------|------|------|
| 主蓝色 | `#2971EB` | 核心结论、标题强调 |
| 天蓝色 | `#22AAFE` | 执行流程、次级信息 |
| 青绿色 | `#05C8C8` | 增长、机会 |
| 紫色 | `#966EFF` | 挑战、风险 |
| 橙黄色 | `#FFB61A` | 强调、警示 |

---

## 仓库结构

```
leon-ppt/
├── SKILL.md               # Skill 主配置
├── style-guide.md         # 视觉规范
├── layout-presets.md      # 版式代码模板
├── pptx-builder.md        # 技术构建文档
├── references/            # 参考文档
│   └── ai-brand-logos.md  # AI 品牌 Logo 映射表
├── README.md              # 本文件
├── assets/                # 资源文件
└── scripts/               # 构建脚本
    └── build_pptx.js
```

---

## 许可证

MIT License
