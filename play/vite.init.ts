import { existsSync, readFileSync, writeFileSync } from "fs";

const app = "src/App.vue";
const example = "app.example.vue";

if (!existsSync(app)) {
    // 读 app.example.vue 文件，然后写入到 src/App.vue
  writeFileSync(app, readFileSync(example));
}
