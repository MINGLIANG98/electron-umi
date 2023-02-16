const { app, BrowserWindow, Menu, protocol } = require('electron');
const remote=require('@electron/remote/main')

const path = require('path');
const url = require('url')


const isDev = process.env.NODE_ENV === 'development'
// window 全局对象
let mainWindow = null;
//  关闭菜单操作栏
Menu.setApplicationMenu(null)
// 是安全策略的设置告警，意思是内容安全策略没有设置，或者使用了unsafe-eval的安全设置。 屏蔽安全报警
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function makeSingleInstance() {
  if (process.mas) return;
  app.requestSingleInstanceLock();
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createWindow() {
  const windowOptions = {
    // width: 1024,
    // height: 768,
    minWidth:1024,
    minHeight:768,
    icon: `${__dirname}/logo.jpg`,
    // fullscreen: true,
    // frame: false, //取消window自带的关闭最小化等
    // resizable: false, //禁止改变主窗口尺寸
    // ===uselayouteffect 阻塞加载 不会出现留白
    // show:false,
    // 深色主题
    darkTheme: true,
    // frame: true,
    webPreferences: {
      // https://blog.csdn.net/zjw0021/article/details/119389249?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-119389249-blog-125986837.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-119389249-blog-125986837.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=1
      // 是否启用Node integration
      nodeIntegration: true, // Electron 5.0.0 版本之后它将被默认false
      // 是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本.默认为 true
      contextIsolation: false,  // Electron 12 版本之后它将被默认true 
      // enableRemoteModule: true, 14.0+ 使用模块导入开启
      // 禁用同源策略
      webSecurity: false,
    },
  };

  // 创建window实例
  mainWindow = new BrowserWindow(windowOptions);
  // 默认最大化
  mainWindow.maximize()

  remote.initialize();
  // 启用remote模块
  remote.enable(mainWindow.webContents);

  // https://www.yuque.com/liulijie-zjrre/ogqn10/ss0tvu?
  if (isDev) {
    // 加载开发
    // mainWindow.loadURL(url); 这里的参数url应该与webpck的devServer配置项的host和port一致。使用Umi创建的项目内置了webpack devServer配置
    mainWindow.loadURL("http://localhost:9080/");
    // Open the DevTools.  默认不打开
    mainWindow.webContents.openDevTools()
  } else {
    // 先打 webpack的包 再把webpack的编译文件打进eclectron包
    // 加载打包
    // mainWindow.loadURL(path.join('file://', __dirname, './index.html'));
    mainWindow.loadFile(`${__dirname}/index.html`);
    // mainWindow.webContents.openDevTools()
  }

  //===========自定义file:///协议的解析=======================
  // protocol.interceptFileProtocol('file', (req, callback) => {
  //   const url = req.url.substring(8,req.url.length);
  //   console.log({req,url});
  //   callback(decodeURI(url));
  // }, (error) => {
  //   if (error) {
  //     console.error('Failed to register protocol');
  //   }
  // });

  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    mainWindow = null
  })
}

makeSingleInstance();
//app主进程的事件和方法
app.on('ready', () => {
  createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
module.exports = mainWindow;
// 原文链接：https://blog.csdn.net/weixin_44043810/article/details/118554069