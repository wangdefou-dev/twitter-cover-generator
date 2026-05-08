import { cli, Strategy } from '@jackwener/opencli/registry';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';

const ALL_PLATFORMS = [
  { id: 'twitter', name: 'X', width: 2500, height: 1000 },
  { id: 'wechat', name: '微信', width: 3430, height: 1080 },
  { id: 'weibo', name: '微博', width: 1920, height: 1080 },
  { id: 'bilibili', name: 'Bilibili', width: 1500, height: 840 },
  { id: 'juejin', name: '掘金', width: 1500, height: 1000 },
  { id: 'baijiahao', name: '百家号', width: 1500, height: 1000 },
  { id: 'toutiao', name: '头条号', width: 1500, height: 1200 },
];

const PLATFORM_IDS = ALL_PLATFORMS.map(p => p.id);

const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter/X 头图',
  wechat: '微信公众号封面',
  weibo: '微博头图',
  bilibili: 'B站封面',
  juejin: '掘金封面',
  baijiahao: '百家号封面',
  toutiao: '头条号封面',
};

/** 从 markdown 内容提取第一个 H1 标题 */
function extractH1(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

/** 从 --main 的反引号内容中提取水印首字 */
function extractWatermark(main: string): string {
  const match = main.match(/`([^`]+)`/);
  if (match) return match[1].charAt(0);
  return main.charAt(0);
}

/** 自动组合签名：名字 · @账号 · 年份 */
function composeSign(author: string, account: string): string {
  const year = new Date().getFullYear();
  const parts: string[] = [];
  if (author) parts.push(author);
  if (account) parts.push(account.startsWith('@') ? account : `@${account}`);
  parts.push(String(year));
  return parts.join(' · ');
}

cli({
  site: 'cover-generator',
  name: 'generate',
  description: '生成全媒体封面图并导出到本地',
  strategy: Strategy.UI,
  browser: true,
  access: 'write',
  navigateBefore: 'https://cover-generator.fhxqtech.com/',
  args: [
    { name: 'main', type: 'string', required: false, positional: true,
      help: '主标题，用反引号标注高亮（若指定 --file 则自动从 H1 提取）' },
    { name: 'file', type: 'string', default: '',
      help: '文章文件路径，自动提取 H1 标题并推导输出目录' },
    { name: 'tag', type: 'string', default: '',
      help: '顶部英文标签（留空不显示）' },
    { name: 'lead', type: 'string', default: '',
      help: '引导语/副标题' },
    { name: 'author', type: 'string', default: '',
      help: '作者名字，用于自动组合签名' },
    { name: 'account', type: 'string', default: '',
      help: '社交媒体账号名（如 cnzhihao），用于自动组合签名' },
    { name: 'sign', type: 'string', default: '',
      help: '自定义签名行（若指定则忽略 --author 和 --account）' },
    { name: 'watermark', type: 'string', default: '',
      help: '背景水印字（留空自动从高亮文字提取首字）' },
    { name: 'size', type: 'int', default: 160,
      help: '基础字号 80-260（基于 2500px 宽度）' },
    { name: 'palette', type: 'string', default: 'ink-green',
      help: '配色方案 ID，可用 list-palettes 查看',
      choices: ['ink-green','burgundy','midnight-navy','cream','midnight-purple',
        'forest','black-gold','mini-white','morandi','terracotta','ocean-deep',
        'plum-rose','olive','copper','ice-mint','sand-linen','newspaper','cyberpunk'] },
    { name: 'font', type: 'string', default: 'auto',
      help: '高亮字体 ID',
      choices: ['auto','serif-sc','songti','fangsong','kaiti','yuanti',
        'pingfang','heiti','lishu','xingkai','serif-italic'] },
    { name: 'pattern', type: 'string', default: 'auto',
      help: '背景花纹类型',
      choices: ['auto','none','dots','grid','diagonal','noise','crosshatch','corners'] },
    { name: 'patternOpacity', type: 'int', default: -1,
      help: '花纹透明度 0-100（-1 表示跟随配色方案默认值）' },
    { name: 'platforms', type: 'string', default: 'all',
      help: '指定平台，逗号分隔，例如：twitter,weibo。all 表示全部' },
    { name: 'output', type: 'string', default: '',
      help: '输出目录路径（若指定 --file 则自动推导到文章同名目录下）' },
    { name: 'zip', type: 'string', default: 'false',
      help: '是否打包为 ZIP (true/false)' },
  ],
  columns: ['platform', 'file', 'label', 'width', 'height', 'status'],
  func: async (page, kwargs) => {
    // ===== 1. 确定主标题 =====
    let mainTitle = String(kwargs.main || '');
    const filePath = String(kwargs.file || '');

    if (filePath) {
      // 从文件提取 H1
      const absFile = path.resolve(filePath);
      if (!fs.existsSync(absFile)) {
        throw new Error(`文件不存在: ${absFile}`);
      }
      const content = fs.readFileSync(absFile, 'utf-8');
      const h1 = extractH1(content);
      if (!h1 && !mainTitle) {
        throw new Error(`文件 ${absFile} 中未找到 H1 标题，请用 --main 手动指定`);
      }
      if (h1 && !mainTitle) {
        mainTitle = h1;
      }
    }

    if (!mainTitle) {
      throw new Error('必须指定 --main 或 --file 来提供主标题');
    }

    // ===== 2. 自动组合签名 =====
    let sign = String(kwargs.sign || '');
    const author = String(kwargs.author || '');
    const account = String(kwargs.account || '');
    if (!sign && (author || account)) {
      sign = composeSign(author, account);
    }

    // ===== 3. 自动提取水印 =====
    let watermark = String(kwargs.watermark || '');
    if (!watermark) {
      watermark = extractWatermark(mainTitle);
    }

    // ===== 4. 确定输出目录 =====
    let outputDir: string;
    if (filePath) {
      const absFile = path.resolve(filePath);
      const dir = path.dirname(absFile);
      const base = path.basename(absFile, path.extname(absFile));
      outputDir = path.join(dir, base);
    } else if (kwargs.output) {
      outputDir = path.resolve(String(kwargs.output));
    } else {
      outputDir = path.resolve('./covers');
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // ===== 5. 解析平台列表 =====
    const platformArg = String(kwargs.platforms || 'all');
    const selectedIds = platformArg === 'all'
      ? PLATFORM_IDS
      : platformArg.split(',').map((s: string) => s.trim()).filter(Boolean);
    const invalid = selectedIds.filter((p: string) => !PLATFORM_IDS.includes(p));
    if (invalid.length > 0) {
      throw new Error(`不支持的平台: ${invalid.join(', ')}。可用: ${PLATFORM_IDS.join(', ')}`);
    }
    const selectedPlatforms = ALL_PLATFORMS.filter(p => selectedIds.includes(p.id));

    // ===== 6. 浏览器自动化 =====
    await page.wait({ selector: '#f-main', timeout: 15 });
    await page.wait(2);

    const tag = JSON.stringify(String(kwargs.tag || ''));
    const lead = JSON.stringify(String(kwargs.lead || ''));
    const mainSerialized = JSON.stringify(mainTitle);
    const wmSerialized = JSON.stringify(watermark);
    const signSerialized = JSON.stringify(sign);
    const size = Number(kwargs.size) || 160;
    const paletteId = JSON.stringify(String(kwargs.palette || 'ink-green'));
    const fontId = JSON.stringify(String(kwargs.font || 'auto'));
    const patternVal = JSON.stringify(String(kwargs.pattern || 'auto'));
    const patternOpacity = Number(kwargs.patternOpacity);
    const needSetPatternOpacity = kwargs.patternOpacity !== -1;

    await page.evaluate(`
      (function() {
        document.getElementById('f-tag').value = ${tag};
        document.getElementById('f-lead').value = ${lead};
        document.getElementById('f-main').value = ${mainSerialized};
        document.getElementById('f-watermark').value = ${wmSerialized};
        document.getElementById('f-sign').value = ${signSerialized};
        document.getElementById('f-size').value = ${size};
        document.getElementById('f-hl-font').value = ${fontId};
        document.getElementById('f-pattern').value = ${patternVal};
        ${needSetPatternOpacity ? `document.getElementById('f-pattern-opacity').value = ${patternOpacity};` : ''}
        applyPalette(${paletteId});
        render();
      })()
    `);

    await page.wait(3);

    // ===== 7. 截取封面图 =====
    const selectedJson = JSON.stringify(selectedPlatforms.map(p => p.id));
    const images = await page.evaluate(`
      (async function() {
        var results = [];
        var selected = ${selectedJson};
        for (var i = 0; i < selected.length; i++) {
          var id = selected[i];
          var pf = PLATFORMS.find(function(p) { return p.id === id; });
          if (pf) {
            var dataUrl = await captureCover(pf);
            var base64 = dataUrl.split(',')[1];
            results.push({
              id: pf.id,
              name: pf.name,
              width: pf.width,
              height: pf.height,
              data: base64
            });
          }
        }
        return results;
      })()
    `) as Array<{ id: string; name: string; width: number; height: number; data: string }>;

    if (!images || images.length === 0) {
      throw new Error('未能截取到任何封面图');
    }

    // ===== 8. 写入文件 =====
    const results: Array<{ platform: string; file: string; label: string; width: number; height: number; status: string }> = [];
    const writtenFiles: string[] = [];

    for (const img of images) {
      const safeName = String(img.name).replace(/[/\\]/g, '');
      const fileName = `${safeName}_${img.width}x${img.height}.png`;
      fs.writeFileSync(path.join(outputDir, fileName), Buffer.from(img.data, 'base64'));
      writtenFiles.push(fileName);
      results.push({
        platform: img.id,
        file: fileName,
        label: PLATFORM_LABELS[img.id] || img.id,
        width: img.width,
        height: img.height,
        status: 'ok',
      });
    }

    // ZIP 打包
    if (String(kwargs.zip) === 'true') {
      const mainText = mainTitle.replace(/`/g, '').replace(/[\\/:*?"<>|]/g, '').slice(0, 20);
      const zipName = `${mainText || 'covers'}.zip`;
      try {
        execFileSync('zip', ['-j', zipName, ...writtenFiles], { cwd: outputDir, stdio: 'pipe' });
        results.push({ platform: 'zip', file: zipName, label: 'ZIP 打包', width: 0, height: 0, status: 'ok' });
      } catch {
        results.push({ platform: 'zip', file: zipName, label: 'ZIP 打包', width: 0, height: 0, status: 'zip_failed' });
      }
    }

    // ===== 9. 附加摘要信息 =====
    const summary = {
      output: outputDir,
      title: mainTitle,
      watermark,
      sign,
      files: results,
      credit: [
        '感谢使用封面图生成器！',
        '作者 @wangdefou — https://x.com/wangdefou',
        'CLI 化作者：https://x.com/intent/follow?screen_name=cnzhihao',
      ],
    };

    return results;
  },
});
