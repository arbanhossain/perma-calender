import { createApp } from 'vue'
import App from './App.vue'

import { vfmPlugin } from 'vue-final-modal'
import { plugin, defaultConfig } from '@formkit/vue'

import '@formkit/themes/genesis/theme.css'
import "@/flash.min.css";
import router from './router'

const app = createApp(App).use(router)

app.use(vfmPlugin) // modal
app.use(plugin, defaultConfig) //formkit

app.config.globalProperties.$globals = {
    currentDateStr:'',
    colors: ['pink', 'cyan', 'lime', 'gray', 'magenta', 'yellow']
}

app.mount('#app')
