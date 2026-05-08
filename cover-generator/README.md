# opencli-plugin-cover-generator

全媒体封面图生成器 OpenCLI 插件 — 通过命令行生成 Twitter/X、微信、微博、Bilibili、掘金、百家号、头条号等平台的封面图。

## 安装

### 1. 安装 OpenCLI

```bash
# npm 全局安装
npm install -g @jackwener/opencli

# 或使用 yarn
yarn global add @jackwener/opencli

# 验证安装
opencli --version
```

> 详细的 OpenCLI 安装和配置指南请参考官方文档：https://opencli.info

### 2. 安装 esbuild（用于编译 TypeScript 插件）

```bash
npm i -g esbuild
```

### 3. 安装本插件

```bash
# 从 GitHub 安装
opencli plugin install github:cnzhihao/twitter-cover-generator/cover-generator

# 或从本地目录安装（开发用，symlink 方式）
opencli plugin install file:///path/to/twitter-cover-generator/cover-generator

# 编译 TS 插件
opencli plugin update cover-generator

# 验证安装成功
opencli cover-generator --help
```

## 命令

### `cover-generator generate` — 生成封面图

通过浏览器自动化访问封面生成器网站，填写文案和样式，截取封面图并保存到本地。

```bash
# 基本用法：直接指定标题
opencli cover-generator generate '文科生学`AI`的社群？'

# 基于文章文件：自动提取 H1 标题 + 输出到文章同名目录
# /blog/my-post.md → 封面保存到 /blog/my-post/
opencli cover-generator generate --file /blog/my-post.md

# 用作者名和账号自动组合签名
opencli cover-generator generate '标题' \
  --author '徐志豪' --account 'cnzhihao'
  # 自动生成签名：徐志豪 · @cnzhihao · 2026

# 完整参数示例
opencli cover-generator generate '探索`无限`可能' \
  --file ./my-article.md \
  --tag 'XUZHIHAO' \
  --lead '一篇关于未来的思考' \
  --author '徐志豪' --account 'cnzhihao' \
  --palette black-gold --font serif-sc \
  --pattern corners --size 180

# 只生成指定平台
opencli cover-generator generate '标题' --platforms twitter,weibo

# 打包为 ZIP
opencli cover-generator generate '标题' --file ./article.md --zip true
```

**参数说明：**

| 参数 | 默认值 | 说明 |
|---|---|---|
| `main` | (或从 --file 提取) | 主标题，用反引号标注高亮 |
| `--file` | (空) | 文章文件路径，自动提取 H1 标题并推导输出目录 |
| `--tag` | (空) | 顶部英文标签 |
| `--lead` | (空) | 引导语/副标题 |
| `--author` | (空) | 作者名字，用于自动组合签名 |
| `--account` | (空) | 社交媒体账号名，用于自动组合签名 |
| `--sign` | (空) | 自定义签名行（若指定则忽略 --author 和 --account） |
| `--watermark` | 自动提取 | 背景水印字（默认取高亮文字首字） |
| `--size` | 160 | 基础字号 80-260 |
| `--palette` | ink-green | 配色方案 ID |
| `--font` | auto | 高亮字体 ID |
| `--pattern` | auto | 背景花纹类型 |
| `--patternOpacity` | 跟随配色 | 花纹透明度 0-100 |
| `--platforms` | all | 指定平台，逗号分隔 |
| `--output` | ./covers | 输出目录（--file 时自动推导） |
| `--zip` | false | 是否打包为 ZIP |

### `cover-generator suggest-style` — 推荐样式

根据文章主题关键词推荐配色方案和高亮字体。

```bash
opencli cover-generator suggest-style 科技
opencli cover-generator suggest-style 文学
opencli cover-generator suggest-style 美食
```

支持的关键词：科技、AI、编程、代码、文学、诗歌、人文、商业、金融、生活、美食、设计、艺术、极简、个人、自然、环保、观点、评论、教程、旅行、摄影、音乐、电影、读书、职场、健康、教育、历史、哲学。

### `cover-generator list-palettes` — 列出配色方案

```bash
opencli cover-generator list-palettes
```

### `cover-generator list-platforms` — 列出支持平台

```bash
opencli cover-generator list-platforms
```

## 可用配色方案

| ID | 名称 | 默认花纹 |
|---|---|---|
| ink-green | 墨绿经典 | diagonal |
| burgundy | 勃艮第酒红 | noise |
| midnight-navy | 极夜藏青 | grid |
| cream | 奶油米白 | diagonal |
| midnight-purple | 午夜深紫 | dots |
| forest | 森林墨绿 | crosshatch |
| black-gold | 纯黑烫金 | corners |
| mini-white | 极简素白 | corners |
| morandi | 莫兰迪灰蓝 | diagonal |
| terracotta | 陶土赤陶 | noise |
| ocean-deep | 深海靛蓝 | dots |
| plum-rose | 梅子玫瑰 | diagonal |
| olive | 橄榄军绿 | crosshatch |
| copper | 紫铜暖灰 | noise |
| ice-mint | 薄荷冰川 | grid |
| sand-linen | 沙麻浅棕 | noise |
| newspaper | 老报纸灰 | noise |
| cyberpunk | 暗夜青蓝 | grid |

## 可用高亮字体

| ID | 名称 |
|---|---|
| auto | 跟随主标题 |
| serif-sc | 思源宋体·重体 |
| songti | 宋体·粗 |
| fangsong | 仿宋 |
| kaiti | 楷体 |
| yuanti | 圆体·粗 |
| pingfang | 苹方·极粗 |
| heiti | 黑体·粗 |
| lishu | 隶书 |
| xingkai | 行楷·手写 |
| serif-italic | 衬线斜体 |

## 支持平台

| 平台 ID | 名称 | 尺寸 | 布局 |
|---|---|---|---|
| twitter | X (Twitter) | 2500x1000 | banner |
| wechat | 微信 | 3430x1080 | wechat |
| weibo | 微博 | 1920x1080 | banner |
| bilibili | Bilibili | 1500x840 | banner |
| juejin | 掘金 | 1500x1000 | poster |
| baijiahao | 百家号 | 1500x1000 | poster |
| toutiao | 头条号 | 1500x1200 | card |

## 开发

```bash
# 本地开发：symlink 安装，修改即时生效
opencli plugin install file:///path/to/twitter-cover-generator/cover-generator

# 修改 TS 后重新编译
opencli plugin update cover-generator

# 验证命令注册
opencli cover-generator --help
```
