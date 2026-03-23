# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## 项目概述

PUA 是一个 AI 编程代理技能插件，利用大厂 PUA 话术（中文版）/ PIP — Performance Improvement Plan（英文版）迫使 AI 穷尽一切方案才能放弃。这是一个纯内容项目——没有构建系统、没有运行时代码、没有测试。所有交付物都是 Markdown 技能文件和规则文件。

作者：探微安全实验室。协议：MIT。当前版本：2.9.0。

## 架构

项目将同一套核心理念适配到多个 AI 编程平台，支持三种语言（中文、英文、日文）：

```
skills/           ← Claude Code 技能（主版本，自动触发）
  pua/SKILL.md        中文版
  pua-en/SKILL.md     英文 PIP 版
  pua-ja/SKILL.md     日文版
  pua-loop/SKILL.md   自动迭代（PUA Loop）
  yes/SKILL.md        ENFP 夸夸模式
  p7/p9/p10/pro/      段位专属模式
commands/pua.md   ← Claude Code 手动触发命令，安装后命令名: /pua:pua（两种安装方式相同）
agents/           ← 多代理团队执行者规则（中/英/日）
cursor/rules/     ← Cursor .mdc 规则文件（3 种语言）
kiro/steering/    ← Claude steering 文件（3 种语言）
codex/pua/        ← OpenAI Codex CLI 适配
codebuddy/pua/    ← 腾讯 CodeBuddy 适配
vscode/           ← VSCode (GitHub Copilot) 适配（3 种语言 × 3 种文件类型）
```

插件元数据位于 `.claude-plugin/plugin.json` 和 `.codebuddy-plugin/plugin.json`。

## 核心设计决策

- **三条铁律**贯穿所有技能变体：(1) 穷尽一切方案才能放弃，(2) 先做后问——先用工具排查，(3) 主动出击，检查关联问题（owner 意识）。
- **压力升级** L1→L4，根据连续失败次数递增，话术越来越激进，并强制执行结构化检查清单。
- **平台对等**：每个平台目录镜像同一套核心逻辑，适配该平台的配置格式（Cursor 用 .mdc，Claude 用 steering/，Claude Code/Codex/CodeBuddy 用 SKILL.md）。
- **loop/yes/p7/p9/p10/pro** 是 PUA 的扩展模块，由 `commands/pua.md` 统一路由，也可在市场安装下直接用 `/pua:yes`、`/pua:pua-loop` 等子命令调用。

## 工作流程

- 没有构建、lint 或测试命令——这是一个纯内容仓库。
- 发布通过推送 `v*` 标签触发，`.github/workflows/release.yml` 会自动创建 GitHub Release 并生成发布说明。
- 落地页为 `landing.html`（静态独立文件）。

## 内容编辑注意事项

- 编辑某一语言的技能变体时，检查是否需要同步修改其他两种语言的变体及对应平台的适配文件。
- SKILL.md 的 frontmatter 字段（`name`、`description`、`version`、`license`）必须与 `.claude-plugin/plugin.json` 保持一致。
- `commands/pua.md` 是一个轻量触发器，引用主技能文件——保持精简。
