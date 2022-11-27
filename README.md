# wx-comp-lib

从 0 到 1 搭建自己的 UI 组件库，记录和分享学到的东西，持续完善～

## 环境配置

1.  新建`package.json`文件
    运行命令：`pnpm init`

    ```json
    {
      "name": "wx-comp-lib",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "",
      "license": "ISC"
    }
    ```

    修改为：

    ```json
    {
      "private": true,
      "workspaces": ["packages/*", "play"],
      "scripts": {
        "dev": "pnpm -C play dev"
      }
    }
    ```

    - `private: true`:代表这是一个私有的
    - `workspaces`: 在`pnpm install`时，会自动将数组里面的包以软链的形式安装在根目录`node_modules`下，方便模块之间引用

2.  创建`pnpm-workspace.yaml`文件

    ```yaml
    packages:
      - packages/*
    ```

    解释：`packages`下面的文件夹当作一个包，通过`monorepo`来管理

3.  配置`ts`
    这里可以查看配置选项的具体含义：https://www.tslang.cn/docs/handbook/compiler-options.html
    `element-plus`源码里面对于`ts`的配置采用`extends`继承配置的方式

    ```sh
    pnpm tsc --init
    ```

    3.1 `tsconfig.json`

    ```json
    {
      "files": [],
      "references": [
        { "path": "./tsconfig.web.json" },
        { "path": "./tsconfig.play.json" },
        { "path": "./tsconfig.node.json" },
        { "path": "./tsconfig.vite-config.json" },
        { "path": "./tsconfig.vitest.json" }
      ]
    }
    ```

    `files`: 用来指定文件列表
    `references`: 就是引入文件

    3.2 `tsconfig.base.json`

    ```json
    {
      "compilerOptions": {
        "outDir": "dist", // 编译之后输出路径
        "target": "es2018", // 编译目标版本
        "module": "esnext", // 指定生成哪种规范的代码， 默认target === "ES6" ? "ES6" : "commonjs"
        "baseUrl": ".",
        "sourceMap": false,
        "moduleResolution": "node", // 处理模块的方式
        "allowJs": false, // 是否容许编译js文件
        "strict": true,
        "noUnusedLocals": true, // 有未使用的局部变量则报错
        "resolveJsonModule": true,
        "allowSyntheticDefaultImports": true, //允许从没有设置默认导出的模块中默认导入
        "esModuleInterop": true,
        "removeComments": false, // 是否删除所有注释
        "rootDir": ".", //仅用来控制输出的目录结构 跟outDir
        "types": [], //要包含的类型声明文件名列表
        "paths": {
          // 配置路径映射，即访问@element-plus/components ==》 packages/components
          "@element-plus/*": ["packages/*"]
        }
      }
    }
    ```

    3.3 `tsconfig.web.json`

    ```json
    {
      "extends": "./tsconfig.base.json", // 继承
      // 覆盖继承的，自定义的
      "compilerOptions": {
        "composite": true, // https://www.typescriptlang.org/docs/handbook/project-references.html#composite
        "jsx": "preserve", //在preserve模式下生成代码中会保留JSX以供后续的转换操作使用（比如：Babel）。 另外，输出文件会带有.jsx扩展名
        "lib": ["ES2018", "DOM", "DOM.Iterable"], //编译过程中需要引入的库文件的列表
        "types": ["unplugin-vue-macros/macros-global"], // 只有这个包会被包含进来 ./node_modules/@types/unplugin-vue-macros/macros-global
        "skipLibCheck": true // 忽略所有的声明文件（ *.d.ts）的类型检查。
      },
      "include": ["packages", "typings/components.d.ts", "typings/env.d.ts"],
      "exclude": [
        // 过滤掉下面这些路径的文件
        "node_modules",
        "**/dist",
        "**/__tests__/**/*",
        "**/gulpfile.ts",
        "**/test-helper",
        "packages/test-utils",
        "**/*.md"
      ]
    }
    ```

    3.4 `tsconfig.play.json`

    ```json
    {
      "extends": "./tsconfig.web.json",
      "compilerOptions": {
        "allowJs": true, // 容许编译js
        "lib": ["ESNext", "DOM", "DOM.Iterable"]
      },
      "include": [
        "packages",
        "typings/components.d.ts",
        "typings/env.d.ts",

        // playground
        "play/main.ts",
        "play/env.d.ts",
        "play/src/**/*"
      ]
    }
    ```

    3.5 `tsconfig.node.json`

    ```json
    {
      "extends": "./tsconfig.base.json",
      "compilerOptions": {
        "composite": true,
        "lib": ["ESNext"],
        "types": ["node"], // 只有./node_modules/@types/node会被包含进来
        "skipLibCheck": true
      },
      "include": [
        "internal/**/*",
        "internal/**/*.json",
        "scripts/**/*",
        "packages/theme-chalk/*",
        "packages/element-plus/version.ts",
        "packages/element-plus/package.json"
      ],
      "exclude": ["**/__tests__/**", "**/tests/**", "**/dist"]
    }
    ```

    3.6 `tsconfig.vite-config.json`

    ```json
    {
      "extends": "./tsconfig.node.json",
      "compilerOptions": {
        "composite": true,
        "types": ["node"]
      },
      "include": ["**/vite.config.*", "**/vitest.config.*", "**/vite.init.*"],
      "exclude": ["docs"]
    }
    ```

4.  安装依赖

    ```sh
    pnpm install typescript @types/node @types/fs-extra @types/jsdom @types/sass @vitejs/plugin-vue -D -W
    ```

    | 依赖库 | 说明 | 开发/生产｜
    | ---- | ---- | ----- ｜
    | unplugin-vue-macros | 扩充更多宏和语法糖到 Vue |-D ｜
    | esbuild、rollup-plugin-esbuild | esbuild编译器 |-D ｜
    | @types/sass,sass | 预处理器 |-D ｜

    `@vitejs/plugin-vue`: 通过 vite 处理.vue 文件
    问题：如何将安装的依赖配置添加到`peerDependencies`中？
    `pnpm install vue --save-peer -w`

5.  将`@element-plus/build-utils`包链接到其它包或者根目录的方式

    - 链接到全局
      在`build-utils`目录下运行`pnpm link --global`，但是出现了如下报错：

      ```sh
       ERROR  Unable to find the global bin directory
       Run "pnpm setup" to create it automatically, or set the global-bin-dir setting, or the PNPM_HOME env variable. The global bin directory should be in the PATH.
      ```

      根据报错提示，运行命令`pnpm setup`

    - 根目录下安装这个包
      在根目录下运行`pnpm add @element-plus/build-utils -Dw `，此时，根目录`package.json`中多出来了一个依赖

      ```json
      {
        "devDependencies": {
          "@element-plus/build-utils": "workspace:^0.0.1"
        }
      }
      ```

    - 源码中`workspace: *`这种是怎么做到的
      在根目录下运行`pnpm add '@element-plus/build-utils@*' -Dw `，其中，`@*`表示默认同步最新版本，省去每次都要同步最新版本的问题，此时，根目录`package.json`中依赖变成了
      当然`pnpm i '@element-plus/build-utils@*' -Dw `也可以
      ```json
      {
        "devDependencies": {
          "@element-plus/build-utils": "workspace:*"
        }
      }
      ```
    - 将`@element-plus/build-utils`添加到某个包中
      如添加到`@element-plus/play`这个里面，运行如下命令：
      `pnpm --filter @element-plus/play add '@element-plus/build-utils@*' -D`

    - 如何删除呢？
      如删除`@element-plus/play`这个包里面的`@element-plus/build-utils`依赖
      `pnpm rm '@element-plus/build-utils@*' --filter @element-plus/play`
