# 全媒体封面图生成器

[![skills.sh](https://skills.sh/b/cnzhihao/twitter-cover-generator)](https://skills.sh/cnzhihao/twitter-cover-generator)

一键生成 Twitter/X、微信公众号、微博、Bilibili、掘金、百家号、头条号等 7 个平台的封面图。

在线体验：https://cover-generator.fhxqtech.com/

**给 AI Agent 安装封面生成能力：**

```bash
npx skills add cnzhihao/twitter-cover-generator
```

## 功能

- **7 个平台**：自动生成 Twitter (2500×1000)、微信 (3430×1080)、微博 (1920×1080)、Bilibili (1500×840)、掘金 (1500×1000)、百家号 (1500×1000)、头条号 (1500×1200) 的封面图
- **18 套配色**：墨绿经典、勃艮第酒红、纯黑烫金、赛博朋克等风格预设
- **11 款高亮字体**：宋体、楷体、隶书、行楷、苹方等
- **7 种背景花纹**：圆点、网格、对角线、噪点、交叉线、四角装饰
- **反引号高亮语法**：标题中用反引号标注关键词，自动高亮着色
- **一键导出 ZIP**：批量导出所有平台封面

## 本地使用

本项目是纯静态 HTML 页面，无需构建工具，直接用任意 HTTP 服务器打开即可：

```bash
# Python
python3 -m http.server 4173

# Node.js (npx)
npx serve .

# PHP
php -S localhost:4173
```

打开 http://localhost:4173 即可使用。

### 操作方式

1. **左侧面板**填写文案：顶部标签、引导句、主标题（用反引号标注高亮）、水印、签名
2. **中间面板**调整样式：字号、高亮字体、背景花纹、配色方案
3. **右侧面板**预览效果：实时渲染所有平台封面缩略图
4. 点击预览卡片导出单个 PNG，或点击顶部按钮一键导出全部 ZIP

## 部署

静态站点，支持任意静态托管平台：

- **Vercel**：直接从仓库根目录部署
- **Cloudflare Workers**：项目已包含 `wrangler.jsonc` 配置，直接 `npx wrangler deploy`

## OpenCLI 插件（Agent 自动化）

内置 OpenCLI 插件，让 AI Agent 通过命令行自动生成封面图。

### 安装

```bash
# 1. 安装 OpenCLI 和 esbuild
npm install -g @jackwener/opencli esbuild

# 2. 安装本项目的封面生成插件
opencli plugin install github:cnzhihao/twitter-cover-generator/cover-generator
opencli plugin update cover-generator

# 3. 验证
opencli cover-generator --help
```

### 使用

```bash
# 直接指定标题生成全部平台封面
opencli cover-generator generate '文科生学`AI`的社群？'

# 从文章文件自动提取标题，封面保存到文章同名目录
opencli cover-generator generate --file ./my-article.md

# 完整参数
opencli cover-generator generate '探索`无限`可能' \
  --author '徐志豪' --account 'cnzhihao' \
  --tag 'XUZHIHAO' \
  --lead '一篇关于未来的思考' \
  --palette cyberpunk --font heiti \
  --platforms all \
  --zip true
```

### 命令列表

| 命令 | 说明 |
|---|---|
| `generate` | 生成封面图（支持 `--file`、`--author`、`--account` 等参数） |
| `suggest-style` | 根据主题关键词推荐配色和字体 |
| `list-palettes` | 列出全部 18 种配色方案 |
| `list-platforms` | 列出全部 7 个支持平台 |

详细参数说明见 [cover-generator/README.md](cover-generator/README.md)。

## 项目结构

```
├── index.html                    # 整个应用（HTML + CSS + JS）
├── wrangler.jsonc                # Cloudflare Workers 部署配置
├── cover-generator/              # OpenCLI 插件
│   ├── generate.ts               #   核心生成命令
│   ├── suggest-style.ts          #   样式推荐命令
│   ├── list-palettes.ts          #   配色列表命令
│   ├── list-platforms.ts         #   平台列表命令
│   ├── opencli-plugin.json       #   插件清单
│   └── package.json
├── .claude/
│   └── skills/
│       └── cover-generator/      # Claude Code Skill
│           └── SKILL.md          #   Agent 生成封面的指导规范
└── README.md
```

## 作者

- **封面生成器**：[@wangdefou](https://x.com/wangdefou)
- **OpenCLI 插件化**：[@cnzhihao](https://x.com/cnzhihao)
