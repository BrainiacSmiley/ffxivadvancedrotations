import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import requireTransform from 'vite-plugin-require-transform'
import VitePluginHtmlEnv from 'vite-plugin-html-env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    requireTransform({
      //filter files that should enter the plugin
      fileRegex: /.js$/,
      //prefix that would plugin into the requireSpecifier
      importPrefix: '_vite_plugin_require_transform_'
    }),
    VitePluginHtmlEnv(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    hot: true
  }
});
