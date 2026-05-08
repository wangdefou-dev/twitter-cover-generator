import { cli, Strategy } from '@jackwener/opencli/registry';

const PLATFORMS = [
  { id: 'twitter', name: 'X', width: 2500, height: 1000, layout: 'banner' },
  { id: 'wechat', name: '微信', width: 3430, height: 1080, layout: 'wechat' },
  { id: 'weibo', name: '微博', width: 1920, height: 1080, layout: 'banner' },
  { id: 'bilibili', name: 'Bilibili', width: 1500, height: 840, layout: 'banner' },
  { id: 'juejin', name: '掘金', width: 1500, height: 1000, layout: 'poster' },
  { id: 'baijiahao', name: '百家号', width: 1500, height: 1000, layout: 'poster' },
  { id: 'toutiao', name: '头条号', width: 1500, height: 1200, layout: 'card' },
];

cli({
  site: 'cover-generator',
  name: 'list-platforms',
  description: '列出所有支持的平台及尺寸',
  strategy: Strategy.PUBLIC,
  browser: false,
  access: 'read',
  columns: ['id', 'name', 'width', 'height', 'layout'],
  func: async () => PLATFORMS,
});
