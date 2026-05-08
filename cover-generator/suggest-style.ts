import { cli, Strategy } from '@jackwener/opencli/registry';

const STYLE_MAP: Record<string, { palette: string; font: string; reason: string }> = {
  '科技': { palette: 'cyberpunk', font: 'heiti', reason: '冷色调科技感' },
  'AI': { palette: 'cyberpunk', font: 'pingfang', reason: '未来感、冷色调' },
  '编程': { palette: 'ocean-deep', font: 'heiti', reason: '深海蓝、专业感' },
  '代码': { palette: 'ocean-deep', font: 'heiti', reason: '深海蓝、技术感' },
  '文学': { palette: 'ink-green', font: 'songti', reason: '经典墨绿、宋体沉稳' },
  '诗歌': { palette: 'ink-green', font: 'kaiti', reason: '经典墨绿、楷体文雅' },
  '人文': { palette: 'newspaper', font: 'fangsong', reason: '老报纸灰、复古感' },
  '商业': { palette: 'black-gold', font: 'serif-sc', reason: '纯黑烫金、高端专业' },
  '金融': { palette: 'midnight-navy', font: 'pingfang', reason: '藏青、稳重专业' },
  '生活': { palette: 'cream', font: 'yuanti', reason: '奶油米白、温暖自然' },
  '美食': { palette: 'terracotta', font: 'yuanti', reason: '陶土赤陶、温暖食欲' },
  '设计': { palette: 'morandi', font: 'pingfang', reason: '莫兰迪灰蓝、有品位' },
  '艺术': { palette: 'plum-rose', font: 'xingkai', reason: '梅子玫瑰、行楷文艺' },
  '极简': { palette: 'mini-white', font: 'heiti', reason: '极简素白、干净对比' },
  '个人': { palette: 'black-gold', font: 'serif-sc', reason: '纯黑烫金、质感强' },
  '自然': { palette: 'forest', font: 'songti', reason: '森林墨绿、清新' },
  '环保': { palette: 'ice-mint', font: 'pingfang', reason: '薄荷冰川、绿色清新' },
  '观点': { palette: 'burgundy', font: 'serif-sc', reason: '勃艮第红、醒目有力' },
  '评论': { palette: 'copper', font: 'heiti', reason: '紫铜暖灰、有力量感' },
  '教程': { palette: 'ocean-deep', font: 'pingfang', reason: '深海蓝、清晰专业' },
  '旅行': { palette: 'sand-linen', font: 'kaiti', reason: '沙麻浅棕、轻松自然' },
  '摄影': { palette: 'black-gold', font: 'heiti', reason: '纯黑烫金、突出图片' },
  '音乐': { palette: 'midnight-purple', font: 'xingkai', reason: '午夜深紫、行楷感性' },
  '电影': { palette: 'midnight-purple', font: 'fangsong', reason: '午夜深紫、仿宋复古' },
  '读书': { palette: 'ink-green', font: 'songti', reason: '墨绿经典、宋体书卷气' },
  '职场': { palette: 'midnight-navy', font: 'pingfang', reason: '藏青、稳重干练' },
  '健康': { palette: 'ice-mint', font: 'yuanti', reason: '薄荷绿、清爽健康' },
  '教育': { palette: 'ocean-deep', font: 'serif-sc', reason: '深海蓝、正式学术' },
  '历史': { palette: 'newspaper', font: 'lishu', reason: '老报纸灰、隶书传统' },
  '哲学': { palette: 'ink-green', font: 'songti', reason: '墨绿经典、宋体深沉' },
};

cli({
  site: 'cover-generator',
  name: 'suggest-style',
  description: '根据文章主题关键词推荐配色方案和高亮字体',
  strategy: Strategy.PUBLIC,
  browser: false,
  access: 'read',
  args: [
    { name: 'keyword', type: 'string', required: true, positional: true,
      help: '主题关键词，如：科技、文学、美食、商业' },
  ],
  columns: ['keyword', 'palette', 'font', 'reason'],
  func: async (_page, kwargs) => {
    const keyword = String(kwargs.keyword || '').trim();
    if (!keyword) {
      return [{ keyword: '', palette: 'ink-green', font: 'auto', reason: '请提供主题关键词，如：科技、文学、美食、商业、设计等' }];
    }
    const result = STYLE_MAP[keyword];
    if (result) {
      return [{ keyword, palette: result.palette, font: result.font, reason: result.reason }];
    }

    // 模糊匹配：尝试用关键词的每个字符去匹配
    for (const [key, val] of Object.entries(STYLE_MAP)) {
      if (key.includes(keyword) || keyword.includes(key)) {
        return [{ keyword: key, palette: val.palette, font: val.font, reason: val.reason }];
      }
    }

    // 无匹配时返回默认推荐
    return [{
      keyword,
      palette: 'ink-green',
      font: 'auto',
      reason: '未匹配到特定主题，使用默认墨绿经典配色。可传入更具体的关键词重试，如：科技、文学、美食、商业、设计等',
    }];
  },
});
