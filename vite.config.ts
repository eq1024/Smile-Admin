import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
import flexbugsFixes from 'postcss-flexbugs-fixes'
import AutoImport from 'unplugin-auto-import/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import monaco from 'vite-plugin-monaco-editor'

function resolvePath(src: string) {
  return path.resolve(__dirname, src)
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  console.log('打包中...', command, mode)

  return {
    base: '/',
    plugins: [
      monaco({}),
      vue(),
      vueJsx(),
      visualizer(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
            resolveIcons: true,
          }),
        ],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolvePath('src/svgs')],
        symbolId: 'svg-[dir]-[name]',
      }),
      AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
        ],
        imports: [
          'vue',
          'vue-router',
          'pinia',
        ],
        dirs: [
          'src/composables',
          'src/utils',
          'src/common',
        ],
        resolvers: [
          AntDesignVueResolver(),
        ],
        vueTemplate: true,
        dts: 'auto-imports.d.ts',
      }),
      createHtmlPlugin({
        minify: true,
        template: 'index.html',
        inject: {
          data: {
            title: 'Smile Admin -- vite4 + typescript + Vue3 + pinia + Ant Design Vue 4',
          },
        },
      }),
    ],

    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              '> 1%',
            ],
            grid: true,
          }),
          flexbugsFixes,
        ],
      },
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      open: false,
      port: 8991,
      proxy: {
        '/request': {
          target: 'http://192.168.0.57:4401',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/request/, ''),
        },
      },
    },
    build: {
      emptyOutDir: true,
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id: any): string {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          },
          chunkFileNames: 'asset/js/[name]-[hash].js',
          entryFileNames: 'asset/js/[name]-[hash].js',
          assetFileNames: 'asset/[ext]/[name]-[hash].[ext]',
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      sourcemap: false,
    },
  }
})
