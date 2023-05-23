import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const pinia = createPinia().use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
