# 介绍
结合`element-plus`，从0到1搭建自己的UI组件库，记录和分享学到的东西，持续完善～

# 项目搭建

# 一、搭建`monorepo`环境

## 1. 初始化项目目录

- 1.1 在`github`新建一个仓库，如：`wx-comp-lib`
- 1.2 使用`pnpm + workspace`实现monorepo

```sh
npm install pnpm -g #全局安装pnpm
pnpm init # 初始化package.json配置文件
touch pnpm-workspace.yaml # pnpm配置文件
pnpm installl vue@next typescript -D # 添加开发依赖
npx tsc --init # 初始化ts的配置文件
```
- 1.3 `package.json`增加配置

```json
{
  "engines": {// 增加对node和pnpm版本的控制
    "node": ">= 16"
  },
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": [ // 忽视以下依赖项，即如果没有安装，也不会报错
        "vite",
        "react",
        "react-dom"
      ]
    }
  },
  "peerDependencies": {// 指定依赖的版本，如果vue的版本是3.1.xx，就不符合要求
    "vue": "^3.2.0"
  }
}
```

- 1.4 `pnpm-workspace.yaml`的配置

```yaml
packages:
 - packages/* # 下面的每一个文件都可以是一个独立的项目
 - play # 测试自己写的组件
```
- 1.5 `.npmrc`的配置

  + shamefully-hoist
  可以参考：https://blog.csdn.net/xgangzai/article/details/120136783
  设置为true：这种方式可以将依赖提升，即底层子项目的依赖会被提升到顶层的`node_modules`中

```npmrc
shamefully-hoist=true
strict-peer-dependencies=false
```