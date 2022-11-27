import {withInstall} from '@element-plus/utils'
import Button from './src/button.vue'

// 注册全局组件elbutton
export const ElButton = withInstall(Button)

export default ElButton

export * from './src/button'