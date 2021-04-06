import { createApp } from 'vue'
import App from './App.vue'
import scrollTracker from '@composables/scroll-tracker'
import grid from '@composables/grid'
import sections from '@composables/sections'
import store from './store'
import './grid-overlay.js'

const app = createApp(App)

app.use(store)
app.use(scrollTracker)
app.use(grid)
app.use(sections, { store })

app.mount('#App')
console.log('index.js', app)
