import { createApp } from "vue";
// 引入样式
// import '@element-plus/theme-chalk/src/dark/css-vars.scss'
(async () => {
  // 动态导入多个vue页面
  const apps = import.meta.glob("./src/*.vue"); 
  // 你知道apps的格式是什么吗？
  //   {
  //     './src/App.vue': () => import("/src/App.vue")
  //   }

  // pathname:'/' 会被替换成 ''
  const name = location.pathname.replace(/^\//, '') || 'App' 
  const file = apps[`./src/${name}.vue`]
  
  if(!file) {
    location.pathname = 'App'
    return
  }
  const App = (await file()).default
  const app = createApp(App);
  app.mount("#play");
})();
