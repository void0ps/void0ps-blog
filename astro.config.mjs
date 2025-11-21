import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import wikiLink from 'remark-wiki-link';
import externalLinks from 'rehype-external-links';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(), 
    tailwind({
      // 允许在 Astro 文件中直接写 Tailwind 类
      applyBaseStyles: false, 
    })
  ],
  markdown: {
    remarkPlugins: [
      [wikiLink, { 
        // 这里配置双链 [[Link]] 点击后跳转的逻辑
        // 默认生成 href="/Link"
        hrefTemplate: (permalink) => `/posts/${permalink}`
      }]
    ],
    rehypePlugins: [
      [externalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ],
    shikiConfig: {
      // 代码高亮主题，推荐赛博朋克风
      theme: 'material-theme-palenight',
      wrap: true,
    },
  },
});