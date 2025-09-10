import { defineConfig } from 'vitepress'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  title: 'Flexi-UI',
  description: '现代化的 React 组件库 - 灵活、高效、易用',
  base: '/',
  lang: 'zh-CN',
  // 忽略死链检查，避免临时的文档链接占位导致构建失败
  ignoreDeadLinks: true,
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'keywords', content: 'React, 组件库, UI, TypeScript, Vite, TDD' }],
    ['meta', { name: 'author', content: 'Flexi-UI Team' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh-CN' }],
    ['meta', { property: 'og:site_name', content: 'Flexi-UI' }],
    ['meta', { property: 'og:title', content: 'Flexi-UI - 现代化的 React 组件库' }],
    ['meta', { property: 'og:description', content: '灵活、高效、易用的 React 组件库，基于 TDD 开发' }],
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '组件', link: '/Button' },
      { text: 'API 参考', link: '/api/' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          collapsed: false,
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '主题定制', link: '/guide/theming' }
          ]
        },
        {
          text: '开发指南',
          collapsed: false,
          items: [
            { text: 'TDD 开发流程', link: '/guide/tdd-development' },
            { text: '组件开发规范', link: '/guide/component-standards' },
            { text: '测试指南', link: '/guide/testing' },
            { text: '贡献指南', link: '/guide/contributing' }
          ]
        }
      ],
      '/': [
        {
          text: '基础组件',
          collapsed: false,
          items: [
            { text: 'Button 按钮', link: '/Button' },
            { text: 'DataTable 数据表格', link: '/DataTable' },
            { text: 'VirtualList 虚拟列表', link: '/VirtualList' },
            { text: 'FileUploader 文件上传', link: '/FileUploader' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '组件 API', link: '/api/components' },
            { text: 'Hooks API', link: '/api/hooks' },
            { text: '工具函数', link: '/api/utils' },
            { text: '类型定义', link: '/api/types' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/flexi-ui' }
    ],
    
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Flexi-UI Team'
    },
    
    editLink: {
      pattern: 'https://github.com/your-org/flexi-ui/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },
    
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  },
  
  vite: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src')
      }
    },
    server: {
      fs: {
        allow: ['..', '../..']
      }
    }
  },
  
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
})