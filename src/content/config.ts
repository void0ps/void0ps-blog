import { defineCollection, z } from 'astro:content';

// 定义博客文章的集合
const posts = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(), // 文章必须有标题
    // 日期设为可选，因为 Obsidian 笔记不一定都有 frontmatter 日期
    // 如果没有日期，我们在页面里会处理显示为 UNKNOWN
    date: z.date().optional(), 
    tags: z.array(z.string()).optional(), // 标签也是可选的
    description: z.string().optional(),
    draft: z.boolean().optional().default(false), // 草稿状态
  }),
});

// 导出集合，名字必须叫 'posts' 以匹配文件夹名
export const collections = { posts };