// Vue
import { createApp } from "vue"
import App from "./App.vue"
import router from "./router/router.js"

// Vuetify
import "@mdi/font/css/materialdesignicons.css"
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
const vuetify = createVuetify({
  components,
  directives,
})


// Tailwind
import "./assets/tailwind.css"

// ChartKick
import 'chartkick/chart.js'
import VueChartkick from 'vue-chartkick'

// Pinia (state management)
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// EventBus
import mitt from "mitt"
const emitter = mitt()

// V-Calendar
import VCalendar from 'v-calendar'
import 'v-calendar/dist/style.css'

createApp(App)
  .use(pinia)
  .use(router)
  .use(vuetify, {iconfont: 'mdi'})
  .use(VCalendar, {})
  .use(VueChartkick)
  .provide('emitter', emitter)
  .mount("#app");

