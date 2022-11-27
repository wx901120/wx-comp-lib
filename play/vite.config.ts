import path from "path";
import { defineConfig, loadEnv } from "vite";
// vite对于vue文件的处理
import vue from "@vitejs/plugin-vue";
// https://www.npmjs.com/package/unplugin-vue-components
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Inspect from "vite-plugin-inspect";
import mkcert from "vite-plugin-mkcert";

// https://github.com/sxzz/unplugin-vue-macros/blob/main/README-zh-CN.md
import VueMacros from "unplugin-vue-macros/vite";

import { epRoot, pkgRoot } from "@element-plus/build-utils";
import esbuild from "rollup-plugin-esbuild";

import "./vite.init";
import type { Plugin } from "vue";

const esbuildPlugin = (): Plugin => ({
  ...esbuild({
    target: "chrome64",
    include: /\.vue$/,
    loaders: {
      ".vue": "js",
    },
  }),
  enforce: "post",
});

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: [
        {
          find: /^element-plus(\/(es|lib))?$/, // (es|lib)? 表示匹配0个或其中一个
          replacement: path.resolve(epRoot, "index.ts"),
        },
        {
          find: /^element-plus\/(es|lib)\/(.*)$/, // element-plus/es/(.*)匹配0个或多个
          replacement: `${pkgRoot}/$2`,
        },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      // 探索并扩充更多宏和语法糖到 Vue的插件
      VueMacros({
        setupComponent: false, // 实验性参数
        setupSFC: false,
        plugins: {
          vue: vue(),
          // vueJsx: vueJsx(),
        },
      }),
      // 将.vue文件转化为js
      esbuildPlugin(),
      // 自动导入组件的,具体功能参考官网介绍
      Components({
        include: `${__dirname}/**`,
        resolvers: ElementPlusResolver({ importStyle: "sass" }),// 解析器
        dts: false,
      }),
      // vite https 开发服务提供证书支持
      mkcert(),
      // 检查Vite插件的中间状态。用于调试和编写插件。
      Inspect(),
    ],
    esbuild: {
      target: "chrome64",
    },
  };
});
