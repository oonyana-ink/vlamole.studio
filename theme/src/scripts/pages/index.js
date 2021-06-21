import { defineAsyncComponent } from 'vue'

export default {
  '/pages/bateleur': defineAsyncComponent(() => import('@/pages/Bateleur.vue'))
}
