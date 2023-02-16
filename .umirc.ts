import { defineConfig } from 'umi';
import routers from './config/routers';
import proxy from './config/proxy';
export default defineConfig({
  // 默认路由模式是“browser”，打包后会出现首页或其他页面找不到继而加载不出来的情况，所以需要改成hash模式。
  hash: true,
  history: {
    // 配置 history 类型和配置项
    type: 'hash', // 可选 browser、hash 和 memory
  },
  access: {},
  /**
   * @name 数据流插件
   * @@doc https://umijs.org/docs/max/data-flow
   */
  model: {},
  /**
   * 一个全局的初始数据流，可以用它在插件之间共享数据
   * @description 可以用来存放一些全局的数据，比如用户信息，或者一些全局的状态，全局初始状态在整个 Umi 项目的最开始创建。
   * @doc https://umijs.org/docs/max/data-flow#%E5%85%A8%E5%B1%80%E5%88%9D%E5%A7%8B%E7%8A%B6%E6%80%81
   */
  initialState: {},
  /**
   * @name 主题的配置
   * @description 虽然叫主题，但是其实只是 less 的变量设置
   * @doc antd的主题设置 https://ant.design/docs/react/customize-theme-cn
   * @doc umi 的theme 配置 https://umijs.org/docs/api/config#theme
   */
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // 'root-entry-name': 'variable',
    // ?不生效
    // 全局变量
    '@primary-color': '#00bab5',
    // 'blue-base': '#00bab5',
    // 'primary-color': '#00bab5',
  },
  // metas: [{ name: 'referrer', content: 'no-referrer' }],
  // https://github.com/umijs/umi/issues/9858
  // 生产环境下需走相对路径
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './', // 配置 webpack 的 publicPath。当打包的时候，webpack 会在静态文件路径前面添加 publicPath 的值
  // 指定webpack包输出路径 防止与electron包路径重叠  再将build包 打包进electron
  outputPath: 'build',
  npmClient: 'yarn',
  routes: routers,
  dva: {},
  request: {},
  proxy: proxy,
  manifest: {
    basePath: '/',
  },
  // 按需导入插件
  plugins: [
    '@umijs/plugins/dist/dva',
    '@umijs/plugins/dist/request',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/access'
  ],
});
