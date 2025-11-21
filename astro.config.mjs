import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import wikiLink from 'remark-wiki-link';
import externalLinks from 'rehype-external-links';

function resolvePublicImages() {
  return (tree) => {
    const visit = (node) => {
      if (node && typeof node === 'object') {
        if (node.type === 'image' && typeof node.url === 'string') {
          if (node.url.startsWith('public/')) {
            node.url = '/' + node.url.replace(/^public\//, '');
          } else if (node.url.startsWith('/public/')) {
            node.url = '/' + node.url.replace(/^\/public\//, '');
          }
        }
        if (Array.isArray(node.children)) {
          for (const child of node.children) visit(child);
        }
      }
    };
    visit(tree);
  };
}

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
    syntaxHighlight: 'shiki',
    remarkPlugins: [
      [wikiLink, { 
        hrefTemplate: (permalink) => {
          if (/\.(png|jpe?g|gif|webp|svg)$/i.test(permalink)) {
            const cleaned = permalink.replace(/^public[\\/]/, '');
            return `/${cleaned}`;
          }
          return `/posts/${permalink}`;
        }
      }],
      resolvePublicImages,
    ],
    rehypePlugins: [
      [externalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
    ],
    shikiConfig: {
      // 代码高亮主题，改为 Dracula 风格
      theme: 'dracula',
      wrap: true,
    },
  },
});