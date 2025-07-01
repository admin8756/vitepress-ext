// types/shims-vue.d.ts
declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // 声明Vue组件的类型，避免类型报错
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}
