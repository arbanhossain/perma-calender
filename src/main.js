import { createApp } from 'vue'
import App from './App.vue'

import { vfmPlugin } from 'vue-final-modal'
import { plugin, defaultConfig } from '@formkit/vue'

import '@formkit/themes/genesis/theme.css'

const app = createApp(App)

app.use(vfmPlugin)
app.use(plugin, defaultConfig)

app.config.globalProperties.$globals = {
    currentDateStr:'',
}

app.mount('#app')
