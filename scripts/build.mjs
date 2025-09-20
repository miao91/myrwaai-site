/**
 * scripts/build.mjs
 * Cross-environment build script without esbuild-style-plugin.
 *
 * - Bundles TS/TSX with esbuild
 * - Processes Tailwind CSS via PostCSS (tailwindcss + autoprefixer)
 * - Copies index.html to dist/
 *
 * Usage:
 *   Dev:  node scripts/build.mjs
 *   Prod: node scripts/build.mjs --production
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

/** Resolve repo root path */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const ASSETS = path.join(DIST, 'assets')

/** Flags */
const isProd = process.argv.includes('--production')

/**
 * ensureDir
 * Ensure a directory exists.
 */
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

/**
 * emptyDir
 * Remove a directory recursively (ignore errors) and recreate it.
 */
async function emptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true })
  await ensureDir(dir)
}

/**
 * copyFile
 * Copy a file from src to dest, creating parent folders.
 */
async function copyFile(src, dest) {
  await ensureDir(path.dirname(dest))
  await fs.copyFile(src, dest)
}

/**
 * buildCSS
 * Use PostCSS to transform src/shadcn.css with Tailwind + Autoprefixer.
 */
async function buildCSS() {
  const inFile = path.join(ROOT, 'src', 'shadcn.css')
  const outFile = path.join(ASSETS, 'app.css')

  const css = await fs.readFile(inFile, 'utf8')
  const result = await postcss([tailwindcss(), autoprefixer()]).process(css, {
    from: inFile,
    to: outFile,
    map: isProd ? false : { inline: false },
    // Tailwind will auto-load tailwind.config.cjs from project root
  })

  await ensureDir(path.dirname(outFile))
  await fs.writeFile(outFile, result.css, 'utf8')
  if (result.map) {
    await fs.writeFile(`${outFile}.map`, result.map.toString(), 'utf8')
  }
}

/**
 * esbuildOptions
 * Shared esbuild build options for both dev and prod.
 */
function esbuildOptions() {
  return {
    entryPoints: [path.join(ROOT, 'src', 'main.tsx')],
    outfile: path.join(ASSETS, 'app.js'),
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    platform: 'browser',
    jsx: 'automatic',
    sourcemap: isProd ? false : 'external',
    minify: isProd,
    legalComments: 'none',
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
  }
}

/**
 * buildJS
 * One-off JS build for production pipeline.
 */
async function buildJS() {
  await ensureDir(ASSETS)
  await esbuild.build(esbuildOptions())
}

/**
 * copyHTML
 * Copy index.html to dist root as-is.
 */
async function copyHTML() {
  const src = path.join(ROOT, 'index.html')
  const dest = path.join(DIST, 'index.html')
  await copyFile(src, dest)
}

/**
 * devServer
 * Start a lightweight dev workflow with esbuild watch + static serve.
 * - Uses esbuild's context API to serve dist/ on port 5173.
 * - Rebuilds CSS on start; watches CSS-related files with a simple throttle.
 */
async function devServer() {
  await emptyDir(DIST)
  await buildCSS()

  const ctx = await esbuild.context(esbuildOptions())
  await ctx.watch()
  await copyHTML()

  // naive CSS watcher: rebuild on any css/tailwind config change
  const watchTargets = [
    path.join(ROOT, 'src'),
    path.join(ROOT, 'tailwind.config.cjs'),
    path.join(ROOT, 'postcss.config.cjs'),
  ]

  let cssPending = false
  const scheduleCssBuild = () => {
    if (cssPending) return
    cssPending = true
    setTimeout(async () => {
      try {
        await buildCSS()
        // keep index.html fresh in case of class changes in examples
        await copyHTML()
        console.log('[dev] CSS rebuilt')
      } catch (e) {
        console.error('[dev] CSS build error:', e)
      } finally {
        cssPending = false
      }
    }, 50)
  }

  // Node's fs.watch has platform differences; we keep it simple
  const { watch } = await import('node:fs')
  for (const target of watchTargets) {
    try {
      watch(target, { recursive: true }, (event, filename) => {
        if (!filename) return
        if (
          filename.endsWith('.css') ||
          filename.endsWith('.tsx') ||
          filename.endsWith('.ts') ||
          filename.includes('tailwind.config') ||
          filename.includes('postcss.config')
        ) {
          scheduleCssBuild()
        }
      })
    } catch {
      // ignore watcher errors in environments not supporting recursive watch
    }
  }

  const { host, port } = await ctx.serve({
    port: 5173,
    servedir: DIST,
  })

  console.log(`\nDev server running at: http://${host}:${port}\n`)
  console.log('Press Ctrl+C to stop.')
}

/**
 * buildProd
 * Full production build for Cloudflare Pages (no server, no watch).
 * Steps:
 *  1) Clean dist
 *  2) Build CSS
 *  3) Build JS
 *  4) Copy index.html
 */
async function buildProd() {
  console.log('[build] production start')
  await emptyDir(DIST)
  await Promise.all([buildCSS(), buildJS()])
  await copyHTML()
  console.log('[build] production done -> dist/')
}

/**
 * Main
 * Decide mode by argv and run.
 */
try {
  if (isProd) {
    await buildProd()
  } else {
    await devServer()
  }
} catch (err) {
  console.error('[build] failed:', err)
  process.exit(1)
}
