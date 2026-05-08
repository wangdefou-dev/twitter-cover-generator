import { cli, Strategy } from '@jackwener/opencli/registry';

const PALETTES = [
  { id: 'ink-green', name: '墨绿经典', pattern: 'diagonal', patternOpacity: 35 },
  { id: 'burgundy', name: '勃艮第酒红', pattern: 'noise', patternOpacity: 40 },
  { id: 'midnight-navy', name: '极夜藏青', pattern: 'grid', patternOpacity: 38 },
  { id: 'cream', name: '奶油米白', pattern: 'diagonal', patternOpacity: 35 },
  { id: 'midnight-purple', name: '午夜深紫', pattern: 'dots', patternOpacity: 40 },
  { id: 'forest', name: '森林墨绿', pattern: 'crosshatch', patternOpacity: 32 },
  { id: 'black-gold', name: '纯黑烫金', pattern: 'corners', patternOpacity: 50 },
  { id: 'mini-white', name: '极简素白', pattern: 'corners', patternOpacity: 55 },
  { id: 'morandi', name: '莫兰迪灰蓝', pattern: 'diagonal', patternOpacity: 32 },
  { id: 'terracotta', name: '陶土赤陶', pattern: 'noise', patternOpacity: 42 },
  { id: 'ocean-deep', name: '深海靛蓝', pattern: 'dots', patternOpacity: 38 },
  { id: 'plum-rose', name: '梅子玫瑰', pattern: 'diagonal', patternOpacity: 30 },
  { id: 'olive', name: '橄榄军绿', pattern: 'crosshatch', patternOpacity: 30 },
  { id: 'copper', name: '紫铜暖灰', pattern: 'noise', patternOpacity: 38 },
  { id: 'ice-mint', name: '薄荷冰川', pattern: 'grid', patternOpacity: 38 },
  { id: 'sand-linen', name: '沙麻浅棕', pattern: 'noise', patternOpacity: 36 },
  { id: 'newspaper', name: '老报纸灰', pattern: 'noise', patternOpacity: 38 },
  { id: 'cyberpunk', name: '暗夜青蓝', pattern: 'grid', patternOpacity: 35 },
];

cli({
  site: 'cover-generator',
  name: 'list-palettes',
  description: '列出所有可用的配色方案',
  strategy: Strategy.PUBLIC,
  browser: false,
  access: 'read',
  columns: ['id', 'name', 'pattern', 'patternOpacity'],
  func: async () => PALETTES.map(p => ({
    id: p.id,
    name: p.name,
    pattern: p.pattern,
    patternOpacity: p.patternOpacity,
  })),
});
