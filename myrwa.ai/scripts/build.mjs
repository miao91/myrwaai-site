/**
 * scripts/build.mjs
 * 使用 esbuild 打包 React + TypeScript，并通过 esbuild-style-plugin 调用 PostCSS + Tailwind。
 * - dev: 运行 `node scripts/build.mjs`（watch + 本地静态服务）
 * - prod: 运行 `node scripts/build.mjs --production`（一次性构建）
 */

import { build as esbuild } from 'esbuild'
import { stylePlugin } from 'esbuild-style-plugin'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import url from 'node:url'
import { fileURLToPath } from 'node:url'
import { rimraf } from 'rimraf'

/** 当前脚本所在目录 */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 项目根目录（scripts/ 的上级） */
const ROOT = path.resolve(__dirname, '..')

/** 解析是否生产模式 */
const isProd = process.argv.includes('--production')

/**
 * cleanDist
 * 清理 dist 目录
 */
async function cleanDist() {
  await rimraf(path.join(ROOT, 'dist'))
}

/**
 * copyIndexHtml
 * 将根目录的 index.html 复制到 dist 根目录
 */
async function copyIndexHtml() {
  const src = path.join(ROOT, 'index.html')
  const destDir = path.join(ROOT, 'dist')
  const dest = path.join(destDir, 'index.html')
  await fs.mkdir(destDir, { recursive: true })
  await fs.copyFile(src, dest)
}

/**
 * serveDist
 * 启动一个超轻量的静态服务器以预览 dist 内容（仅 dev 使用）
 */
function serveDist({ port = 5173 } = {}) {
  const distDir = path.join(ROOT, 'dist')

  /** 简易类型映射 */
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.woff2': 'font/woff2',
  }

  const server = http.createServer(async (req, res) => {
    try {
      const parsed = url.parse(req.url || '/')
      let pathname = parsed.pathname || '/'
      // 统一用 dist 目录
      let filePath = path.join(distDir, pathname)

      // 如果请求的是目录，则返回 index.html
      const stat = await fs
        .stat(filePath)
        .catch(() => null)

      if (!stat || (stat && stat.isDirectory())) {
        filePath = path.join(distDir, 'index.html')
      }

      const ext = path.extname(filePath).toLowerCase()
      const type = mime[ext] || 'application/octet-stream'
      const content = await fs.readFile(filePath)
      res.writeHead(200, { 'Content-Type': type })
      res.end(content)
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Not Found')
    }
  })

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Dev server running: http://localhost:${port}`)
  })
}

/**
 * build
 * 执行 esbuild 构建，产出到 dist/assets
 */
async function build() {
  await cleanDist()

  const result = await esbuild({
    entryPoints: [path.join(ROOT, 'src', 'main.tsx')],
    bundle: true,
    format: 'esm',
    splitting: true,
    sourcemap: !isProd,
    minify: isProd,
    target: ['es2018'],
    outdir: path.join(ROOT, 'dist', 'assets'),
    entryNames: 'app',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    plugins: [
      stylePlugin({
        // 通过 PostCSS 执行 tailwindcss 与 autoprefixer
        postcss: {
          plugins: [
            (await import('tailwindcss')).default(),
            (await import('autoprefixer')).default(),
          ],
        },
      }),
    ],
    // 保持目录结构整洁
    loader: {
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.svg': 'file',
      '.woff2': 'file',
    },
    logLevel: 'info',
    // dev 模式开启 watch，用于本地预览
    watch: isProd ? false : {
      onRebuild(error) {
        if (error) {
          // eslint-disable-next-line no-console
          console.error('Rebuild failed:', error)
        } else {
          // eslint-disable-next-line no-console
          console.log('Rebuilt successfully')
          copyIndexHtml().catch((e) => console.error(e))
        }
      },
    },
  })

  await copyIndexHtml()

  if (!isProd) {
    serveDist({ port: 5173 })
  }

  return result
}

build().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
