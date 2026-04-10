# Contributing to HRT药典

感谢你愿意为跨性别社群贡献力量！

## How to Contribute

### Bug Reports / 问题反馈

请通过 [GitHub Issues](https://github.com/Loveil381/yakuten/issues) 提交，使用对应的 Issue 模板。

### Content Corrections / 内容纠错

医学内容的准确性是本站的生命线。如果你发现：

- 引用错误或过时的数据
- 缺少 DOI 引用的医学声明
- 剂量信息与指南不符

请提交 Issue 并附上正确的参考文献（DOI 优先）。

### Translation / 翻译

目前支持中文、英文、日文三语。韩语翻译是下一个优先级。

翻译贡献需要：
1. 在 `src/content/docs/{locale}/` 下创建对应语言的 MDX 文件
2. 翻译 `src/i18n/ui.ts` 中的 UI 字符串
3. 保持与原文相同的 frontmatter 结构和 CitationRef 引用

### Code Contributions / 代码贡献

1. Fork 本仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 确保通过构建检查 (`npm run build`)
4. 提交你的更改
5. 创建 Pull Request

### Medical Review / 医学审阅

如果你是内分泌科医生、跨性别医疗从业者或相关领域研究者，你的审阅意见对我们非常宝贵。请通过 Issue 或 PR 提供反馈。

## Content Rules

所有内容贡献必须遵守以下规则：

- 每条医学声明**必须**附带 `<CitationRef>` 组件和 DOI 链接
- 不得使用绝对化表述（「一定」→「建议」）
- 剂量数据必须标注来源指南名称和年份
- 证据等级标注：A (RCT/Meta) / B (单项 RCT/队列) / C (病例/专家) / X (无证据)
- **不得**包含购药链接或商业推广内容

## Development Setup

```bash
npm install
npm run dev          # localhost:4321
npm run build        # Production build with content validation
npm run check        # TypeScript + content validation
```

## Code of Conduct

本项目致力于为所有人提供一个友好、安全、包容的参与环境。我们不容忍任何形式的骚扰、歧视或恶意行为。

---

*谢谢你。每一份贡献都在帮助某个人更安全地走过这段旅程。*
