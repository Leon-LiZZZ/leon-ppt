# AI 品牌 Logo 映射表（lobe-icons）

---

## CDN 地址格式

- **npmmirror**：`https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons/{slug}.svg`
- **unpkg**：`https://unpkg.com/@lobehub/icons-static-svg@latest/icons/{slug}.svg`
- **PNG fallback**：`https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/icons/{slug}.png`

---

## 国际 AI 大模型

| 用户内容关键词 | lobe-icons Slug |
|--------------|-----------------|
| OpenAI / ChatGPT / GPT-4 | `openai` |
| Claude / Anthropic | `claude` |
| Gemini / Google AI | `gemini` |
| DeepSeek | `deepseek` |
| Llama / Meta AI | `metaai` |
| Mistral | `mistral` |
| HuggingFace | `huggingface` |
| AWS / Amazon | `aws` |
| Azure | `azure` |
| Google Cloud | `googlecloud` |
| Perplexity | `perplexity` |
| Ollama | `ollama` |
| GitHub Copilot | `githubcopilot` |

---

## 中国 AI 大模型

| 用户内容关键词 | lobe-icons Slug |
|--------------|-----------------|
| 通义千问 / Qwen | `qwen` |
| 阿里云 | `alibabacloud` |
| 文心一言 / 百度 | `wenxin` |
| 豆包 / 字节 | `doubao` |
| Kimi / 月之暗面 | `moonshot` |
| 智谱 / ChatGLM | `chatglm` |
| 混元 / 腾讯 | `hunyuan` |
| 华为云 / 盘古 | `huaweicloud` |
| 讯飞 / 星火 | `spark` |
| 百川 | `baichuan` |
| MiniMax | `minimax` |

---

## AI 开发基础设施

| 用户内容关键词 | lobe-icons Slug |
|--------------|-----------------|
| MCP | `mcp` |
| LangChain | `langchain` |
| LlamaIndex | `llamaindex` |
| CrewAI | `crewai` |

---

## 降级处理

| 情况 | 处理方式 |
|------|---------|
| Slug 找不到 | 跳过 logo，使用 emoji 替代 |
| CDN 拉取失败 | 切换备用 CDN，仍失败则跳过 |
| 单页 logo > 6 个 | 合并为「logo 墙」版式 |
