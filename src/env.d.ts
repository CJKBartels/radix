// Tells TypeScript what importing a .vue file gives you: a Vue component.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
