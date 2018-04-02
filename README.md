

## 什么是快应用

简单地说快应用是国内的十大主流手机厂商比如小米、华为、ov等联合推出的一种新型应用。无需安装，秒开，体验媲美原生。还提供了像原生应用一样的入口：应用商店，搜索页等。

## 开发前准备

接下来会教大家如何搭建、启动、预览和调试快应用项目。和[官方文档](https://doc.quickapp.cn/)类似，这里我增加了一些我在这过程中遇到的坑及解决方法。

### 创建项目

#### 安装 NodeJS

官方说需安装 6.0 以上版本的 NodeJS，推荐 v6.11.3，但我本机 NodeJS 是 v9.3.0，暂时没发现异常就没切到 6.0。

#### 安装 hap-toolkit

hap-toolkit 是快应用的开发者工具，帮助开发者通过命令行工具辅助开发工作的完成，主要包括创建模板工程，升级工程，编译，调试等功能。类似 vue-cli。

```bash
npm install -g hap-toolkit
```

安装之后查看下版本号看是否安装成功。

```bash
hap -V
```

#### 创建项目

运行如下命令会在当前目录下创建 `<ProjectName>` 目录作为项目的根目录。

```bash
hap init <ProjectName>
```

这个项目已经包含了项目配置与示例页面的初始代码，项目根目录主要结构如下。

```
├── sign                      rpk 包签名模块
│   └── debug                 调试环境
│       ├── certificate.pem   证书文件
│       └── private.pem       私钥文件
├── src
│   ├── Common                公用的资源和组件文件
│   │   └── logo.png          应用图标
│   ├── Demo                  页面目录
│   |   └── index.ux          页面文件，可自定义页面名称
│   ├── app.ux                APP 文件，可引入公共脚本，暴露公共数据和方法等
│   └── manifest.json         项目配置文件，配置应用图标、页面路由等
└── package.json              定义项目需要的各种模块及配置信息
```

#### 安装依赖

```bash
npm install
```

### 启动项目

编译

```
npm run build
```

编译生成的 `dist` 目录里才是最终产物：`rpk` 文件。

这一步可能会遇到报错（我就遇到了）。

```
Cannot find module '.../node_modules/hap-tools/webpack.config.js'
```

主要是因为创建项目后就有一个 `node_module` 文件夹了，里面有一个 `hap-tools` 包。如果 `npm install` 安装依赖，高版本的 `npm` 可能会把 `node_module` 原有的包清空再安装依赖，这时只要再手动安装下 `hap-tools` 就行了

```bash
npm install hap-tools
```

如果要监听源码变化自动编译，可以运行 watch 命令。

```bash
npm run watch
```

到这一步一个 hello world 的快应用就打包好了，下面需要在手机上把它跑起来。

### 预览

首先需要安装手机[调试器](https://www.quickapp.cn/docCenter/post/69)。

![](https://user-gold-cdn.xitu.io/2018/3/30/16275620ebed1583?w=360&h=640&f=png&s=28441)

只安装这个快应用调试器会发现上面的按钮都是灰色不可点击的，这时还需要安装平台预览版调试器，总之[快应用文档](https://www.quickapp.cn/docCenter/post/69)上的手机调试器都要安装才能调试。

安装好调试器后就把快应用安装包安装到手机上就可以了。

#### 扫码安装

需要启动一个本地 HTTP 服务器。

```bash
npm run server
```

![](https://user-gold-cdn.xitu.io/2018/3/30/1627564b7eb7d4d5?w=1174&h=828&f=png&s=197137)

如果命令行中的二维码扫了没反应，可以把那个地址在浏览器中打开在扫码试试（我就是这样），因为命令行中的二维码可能绘制的有问题。

#### 本地安装

把 `rpk` 文件传到手机上安装即可。

#### 在线更新

快应用调试器右上角可以设置服务器地址，运行以下命令每次改了代码就可以点击在线更新就可以更新了，不用每次都扫码或本地安装。

```bash
npm run server
npm run watch
```

### 调试

可以手机上预览，也可以使用 chrome devtools 调试界面，还可以查看调试日志。手机上预览上面说了，其他调试按[官方步骤](https://doc.quickapp.cn/tools/debugging-tools.html)来就好了。

**可能的坑**：在用chrome devtools调试的时候可能打不开调试界面，或者调试界面空白。这时需检查：

- 在手机调试器上点击了开始调试（点了就会自动在 pc chrome 上打开 devtools）
- 确保手机和电脑在同一个网段
- 检查代理，设置了代理的把代理关了试试（我就是因为设置了代理 devtools 空白）

![](https://user-gold-cdn.xitu.io/2018/3/30/1627568b38356ef9?w=835&h=822&f=png&s=56240)

## 5 分钟上手教程

以一个列表页和详情页为例说明快应用的代码，数据来源[迅雷影评](http://movie.xunlei.com/)。

先看下[demo运行效果](./doc/demo.mp4)

### Manifest.json

在 `manifest.json` 中配置路由后就可以写代码了，生成的模板有例子。注意不能配置动态路由。

注意用到的[系统接口](https://doc.quickapp.cn/features/)要先在 `manifest.json` 的 `feature` 中声明。看 [manifest 的文档](https://doc.quickapp.cn/framework/manifest.html)了解具体的配置项。

```json
{
  "package": "com.xunlei.movie",
  "name": "迅雷影评",
  "versionName": "1.0.0",
  "versionCode": "1",
  "minPlatformVersion": "101",
  "icon": "/Common/logo.png",
  "features": [
    { "name": "system.prompt" },
    { "name": "system.router" },
    { "name": "system.shortcut" },
    { "name": "system.fetch" },
    { "name": "system.webview" } 
  ],
  "permissions": [
    { "origin": "*" }
  ],
  "config": {
    "logLevel": "debug",
    "designWidth": 640
  },
  "router": {
    "entry": "List",
    "pages": {
      "List": {
        "component": "index"
      },
      "Detail": {
        "component": "index"
      },
      "About": {
        "component": "index"
      }
    }
  }
}
```

### 列表
列表使用了快应用的list组件，这个组件是Native组件，对长列表滚动性能更好，list组件还有一个onscrollbottom事件，方便下拉加载。

image组件和前端的img标签类似，但是alt属性不同，alt是用来显示占位图的，只能是本地图片，在图片没加载出来前显示。

list-item组件中的type是必填的，要实现DOM片段的复用，要求相同type属性的DOM结构完全相同；所以设置相同type属性的list-item是优化列表滚动性能的关键。
```html
<template>
  <list class="list-main" onscrollbottom="loadData">
    <list-item class="list-item" type="review" for="{{item in list}}">
      <image  class ="art-pic" 
        src="{{item.img}"
        alt="../Common/assets/img/default.png">
      </image>
      <text class="art-title">{{item.title}}</text>
    </list-item>
    <!-- 加载更多，type属性自定义命名为loadMore -->
    <list-item type="loadMore" class="load-more" show="{{hasMore}}">
      <progress type="circular" class="round"></progress>
      <text>加载更多</text>
    </list-item>
  </list>
</template>
```
快应用的网络请求是用fetch方法，是callback的形式，不方便调用，官方给了一个封装成promise的例子，可以用async/await的方式调用。

将封装好的fetch方法在app.ux中导出就可以全局使用了，由于我使用的接口都返回json，所以直接就在这一层解析了。实际开发时要注意JSON.parse的报错处理。
```javascript
// app.ux
const natives = {
    /**
     * 网络请求
     * @param options
     * @return {Promise}
     */
    async fetch (options) {
      const p1 = new Promise((resolve, reject) => {
        options.success = function (data, code) {
          data = JSON.parse(data.data)
          resolve({ data, code })
        }
        options.fail = function (data, code) {
          reject({ data, code })
        }
        nativeFetch.fetch(options)
      })
      return p1
    }
  }
  // 注入到全局
  const hookTo = global.__proto__ || global
  hookTo.natives = natives
  
  export default {
    natives
  }
```
路由跳转

```html
<template>
  <list>
     <list-item onclick="{{goDetail(item.id)}}" for="item in list"></list-item>
  </list>
</template>
<script>
import router from '@system.router'
  
export default {
  goDetail (id) {
      router.push({
        uri: '/Detail',
        params: { id }
      })
   }
}
</script>
```
### webview

详情页只是加载了一个 webview， 用列表页传过来的 id 去请求影评详情，影评正文是存在 cdn 上的一个地址。使用 `web` 组件前需在 `manifest.json` 中声明使用 webview 接口。

```html
<!-- Detail/indev.ux -->
<template>
  <!-- template里只能有一个根节点 -->
  <div>
    <web src="{{review.body_url}}" id="web"></web>
  </div>
</template>

<script>
  import api from '../Common/api/index.js'

  export default {
    data: {
      id: '', // 列表页传过来的id
      review: {}
    },
    onMenuPress() {
      this.$app.showMenu()
    },
    onInit () {
      this.getReview()
    },
    async getReview () {
      try {
        let data = await api.getReview(this.id)
        this.review = data.cinecism_info || {}
        this.$page.setTitleBar({ text: this.review.title })
      } catch (error) {
        console.log(error)
      }
    }
  }
</script>
```
## 与前端开发比较

快应用与前端开发的最大的区别就是 html 和 css 部分，因为快应用是用原生的方式实现的，但没有实现html的所有标签，而且与 html 相同的标签在用法上也有一些差别。

### html

快应用中很多 html 都不能用，比如没有 p,h1~h2 等，因为它只是模拟了部分 html 标签,最终会转化成原生组件。

而且快应用中的组件嵌套子组件是有限制的，不是所有的组件都能嵌套子组件，如果嵌套不正确编译的时候会报错。比如下面就是不正确的写法：

```html
<!--错误-->
<a href="">
 <image src="http://pic.com/1.jpg"></image>
</a>
```

#### 文本组件

只能使用 a、span、text、label 放置文本内容

#### 图片组件

图片组件是 image 不是 img，用法与 img 类似，只是 alt 的含义不同，在快应用中 alt 是指图片没加载出来前的占位图，只能是本地地址。
```
<image src="http://pic.com/1.jpg" alt="1.jpg"></image>
```
#### 其他

表单组件、video 组件等与前端一致，还有一些快应用特有的组件，比如星级评分组件、进度条组件、list 组件等。

### css

- display 只能是 flex 或 none
- position 只能是 fixed 或 none
- 长度单位只有 px 和 %
> 与传统web页面不同，px 是相对于项目配置基准宽度的单位，已经适配了移动端屏幕，其原理类似于 rem。基准宽度可以在 mainifest.json 中配置。

### javascript

基本语法都能用，ES6 也可以用，项目中已经安装了 babel 依赖。一些浏览器特有的 API 可能不同。比如数据存储用的是快应用的接口 storage。

## 与 Vue 比较

由于我们团队主要是用 Vue 技术栈开发，所以比较下快应用在语法上和 Vue 的共同点和差异之处。快应用看起来和 Vue 类似，其实还是有很大的差别。

- 都有指令的概念，只是写法不同， 目前不能自定义指令
```html
<!--左边是 vue 语法 右边是快应用语法-->
v-for => for
v-show => show
v-if => if
template => block
slot => slot
```
- 快应用的路由是通过配置文件 `manifest.json` 配置的，在实例中的用法与vue-router 一致
- 都有组件概念，组件引入的方式略有不同
```javascript
// vue
import child from './childComponent'
// 快应用
<import name="child" src="./childComponent"></import>
```
- 事件的监听和触发与 Vue 类似，都是 `$on` `$off` `$emit`,监听原生组件的事件写法不同
```html
<!--vue-->
<div v-on:click="handleClick"><div>
<div @click="handleClick"><div>
<!--快应用-->
<div onclick="{{handleClick()}}"><div>
```
- 组件间通信和纯 Vue 类似，可以通过 props，也可以挂载在全局对象上
- Vue 生态系统都不能用，比如 Vuex,目前没有插件机制

## 优缺点

### 优点

- 提供了很多系统的功能，比如分享、通知、扫描二维码、添加图标到桌面
- 用户体验好，无需下载，秒开，占用内存小
- 可以关联原生应用

### 缺点
- 每个平台都要注册个账号
- 没有一个集成开发环境，调试麻烦，且 devtools 很卡
- rpk 文件最大1M
- 国内手机厂商推出的，自然是不支持 ios 了

## 总结

写demo的时候还是遇到了不少坑，主要是html和css部分。像我们公司前端和重构是分开的，重构只负责写 html+css，前端负责写逻辑调接口等杂七杂八的事情，快应用和小程序这种形式对重构来说很麻烦，不能写一份代码到处用了。

还有就是详情页显示影评正文的时候遇到了一个问题。我们影评的正文是存在cdn上的一堆html标签，无样式，可能有一些和快应用不兼容的标签，所以用 webview 的方式加载页面。但是不知道怎么向 webview 中注入 css ，所以页面是乱的。

总的来说，快应用这种形态对用户来说还是很好的，在下载 APP 前就可以体验到应用的一些功能。快应用的快在于它进行了很多原生的优化，也在于它小，小到用户感觉不到，这也注定它不能做的很复杂，所以快应用只是一个导流的方式。

## 代码地址

[https://github.com/greenfavo/quickapp-demo](https://github.com/greenfavo/quickapp-demo)

## 参考文档

[快应用开发文档](https://doc.quickapp.cn/)

## 扫一扫关注迅雷前端公众号

![](https://user-gold-cdn.xitu.io/2017/9/18/a61c018adbf0a3e865643c51e91251bb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
