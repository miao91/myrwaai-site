# myrwa.ai - 前端项目

本项目使用 React 18 + TypeScript + Tailwind CSS + esbuild。已配置 Cloudflare Pages 的推荐构建方式。

## 开发

```bash
npm ci
npm run dev
# 启动本地预览： http://localhost:5173
```

## 构建

```bash
npm run build
# 产物在 dist/
```

## 目录说明

- `src/`：应用源码（路由、页面、组件等）
- `index.html`：应用入口 HTML（构建后复制到 dist 根目录）
- `scripts/build.mjs`：构建脚本（dev/production）
- `tailwind.config.cjs` / `postcss.config.cjs`：样式构建配置
- `tsconfig.json`：TypeScript 配置
- `dist/`：构建输出（自动生成）

## Cloudflare Pages 部署

- Build command: `npm run build`
- Output directory: `dist`
- 环境变量：`NODE_VERSION=20`

绑定域名（如果 DNS 在 Cloudflare）：
- Pages 项目 → “Custom domains” → 添加 `myrwa.ai` 与 `www.myrwa.ai`
- 将 `myrwa.ai` 设为 Primary（推荐）
- 可在 Routing → Redirect Rules 添加 301：`https://www.myrwa.ai/*` → `https://myrwa.ai/$1`

## 常见问题

- 构建失败：确认本地 `npm run build` 能成功；Cloudflare Pages 中设置 `NODE_VERSION=20`
- 线上空白：确认 Pages 的 Output 目录为 `dist`；本项目使用 HashRouter，无需额外路由重写
