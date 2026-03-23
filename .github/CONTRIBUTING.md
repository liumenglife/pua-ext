# Contributing to PUA Skill

感谢你对 PUA Skill 的关注！以下是提交 Issue 和 PR 的规范。

## Issue 提交规范

### 1. 必须归类

每个 Issue 必须使用模板并选择正确的类型：

| 类型 | 前缀 | 用途 |
|------|------|------|
| Bug | `bug:` | 功能异常、命令不触发、hook 报错 |
| Feature | `feat:` | 新功能、新味道、新平台支持 |
| Question | `question:` | 使用疑问（提问前请先查阅 [Guide](https://openpua.ai/guide.html)） |

不符合归类规范的 Issue 将被关闭并要求重新提交。

### 2. 关于 "PUA 话术是否有效" 的讨论

PUA Skill 的理论基础已在我们的研究博客中系统阐述：

**[Emotion/Persona Prompting 对 AI Agent 效果的系统性分析](https://openpua.ai/blog/emotion-persona-prompting.html)**

核心结论：
- PUA Skill 85-90% 的效果来自**结构化行为约束**（checklist、escalation protocol、验证步骤），而非情感修辞
- PUA 话术（"3.25"、"毕业"等）的真正作用是**注意力锚定和行为路由信号**，不是"激发 AI 的情感"
- 这一结论基于 20+ 篇顶会论文（ACL/EMNLP/ICML/IJCAI）的系统梳理

**以下类型的 Issue 不会被接受：**
- 仅凭 AI 工具（ChatGPT/Claude/Gemini 等）分析本项目代码后得出"PUA 话术对 LLM 无效"的结论来否定项目价值。我们已经在上述博客中对这个问题做了比任何 AI 摘要更深入的分析，包括 EmotionPrompt/Persona Prompting 的局限性、Anthropic Persona Vectors 的机制差异、以及 PUA 话术作为 routing signal 的量化分解
- 没有提供**新的实验数据或论文引用**、仅靠观点否定的 Issue

**欢迎的讨论方式：**
- 带有自己的 A/B 实验数据的效果质疑（如 [PR #82](https://github.com/tanweai/pua/pull/82) 的 SM skill 就是很好的范例）
- 引用我们博客中未覆盖的新论文
- 基于具体场景的改进建议

### 3. 社区行为准则

**以下行为将导致自动化处理：**
- 对项目或维护者的攻击、辱骂、人身攻击 → Issue 将被自动关闭，账号将被永久拉黑
- 垃圾信息、广告、无关内容 → 自动关闭
- 重复提交已关闭的 Issue → 自动关闭

我们使用自动化工具监控 Issue 内容。恶意行为零容忍。

## PR 提交规范

- 每个 PR 解决一个问题，不要混合多个无关改动
- PR 标题使用 conventional commit 格式：`fix:` / `feat:` / `chore:` / `docs:`
- 如果改了核心 SKILL.md，请说明改动的理由和预期效果
- 如果改了多个平台的文件（cursor/kiro/vscode/codex），请确保内容同步

## 联系方式

- Telegram: https://t.me/+wBWh6h-h1RhiZTI1
- Discord: https://discord.gg/EcyB3FzJND
- Email: minwei.wang@tanweai.com
