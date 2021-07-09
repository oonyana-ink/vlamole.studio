import { defineAsyncComponent } from 'vue'

export default {
  '/?$': () => { window.location = '/products/bateleur' },
  '/products/bateleur': defineAsyncComponent(() => import('@/pages/Bateleur.vue')),
  '/policies': defineAsyncComponent(() => import('@/pages/Policies.vue'))
}
