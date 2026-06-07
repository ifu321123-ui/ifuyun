# 个人品牌网站 · AI 复合型产品经理

基于 Vite + React 19 + TypeScript + Tailwind CSS v4 构建的个人品牌单页网站（SPA），采用 hash 路由，可作为纯静态站点部署。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 构建工具 | Vite 8 |
| 框架 | React 19 + React DOM 19 |
| 语言 | TypeScript 5.7 |
| 样式 | Tailwind CSS v4（`@tailwindcss/vite` 插件） |
| 图标 | lucide-react |
| 路由 | 基于 `window.location.hash` 的轻量级路由（见 `src/hooks/useRoute.ts`），无需服务端重写 |

## 环境要求

- Node.js ≥ 18（推荐 20 / 22 LTS）
- npm ≥ 9

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（带热更新）
npm run dev
```

## 命令说明

| 命令 | 作用 | 默认端口 |
| --- | --- | --- |
| `npm run dev` | 启动开发服务器，支持 HMR 热更新 | http://localhost:5173 |
| `npm run build` | 生产打包，输出到 `dist/` | — |
| `npm run preview` | 本地预览打包产物，用于上线前验证 | http://localhost:4173 |

> 说明：`vite build` 使用 esbuild 打包，**默认不做类型检查**。如需在打包时一并校验类型，可手动执行 `npx tsc --noEmit`，或将 build 脚本改为 `"build": "tsc --noEmit && vite build"`。

### 自定义端口 / 对外暴露

```bash
# 指定端口
npm run dev -- --port 3000
npm run preview -- --port 8080

# 在局域网内暴露（供同网络其他设备访问）
npm run dev -- --host
npm run preview -- --host
```

## 构建产物

执行 `npm run build` 后，所有静态资源生成到 `dist/` 目录：

```
dist/
├── index.html
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

## 部署

本项目是纯静态站点，将 `dist/` 目录上传到任意静态托管服务即可。

### 通用步骤

```bash
npm install
npm run build
# 将 dist/ 目录内容部署到托管服务
```

### 常见平台

- **Vercel / Netlify**：构建命令 `npm run build`，输出目录 `dist`。
- **GitHub Pages / 对象存储（OSS、S3 等）**：直接上传 `dist/` 内容。
- **Nginx 等自建服务器**：将 `dist/` 作为站点根目录。

> 由于路由基于 URL hash（如 `/#/projects`），刷新页面不会丢失路由，**无需配置 SPA fallback 重写规则**。

## 目录结构

```
.
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置（含 @ -> src 路径别名）
├── src/
│   ├── main.tsx            # 应用入口
│   ├── App.tsx             # 根组件
│   ├── data.ts             # 站点内容数据
│   ├── index.css           # 全局样式 / Tailwind 入口
│   ├── components/         # 页面区块组件（Hero、About、Projects 等）
│   ├── hooks/              # 自定义 Hooks（useRoute、useInView）
│   └── lib/                # 工具函数
└── dist/                   # 构建产物（自动生成，不纳入版本管理）
```
