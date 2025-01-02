![](demo/demo.gif)

1、注册 expo 账号

https://expo.dev/

2、全局安装

npm i -g eas-cli expo-cli（expo-cli 用于开发，eas-cli 用于推送云打包）（旧版本的 expo 也是用 expo-cli 创建项目的）

3、新版的 expo 不用使用脚手架创建项目，直接使用命令创建项目

旧版（基于 expo-cli 创建）：yarn create expo-app

新版（expo 51 直接命令创建）：npx create-expo-app@latest

4、手机下载 Expo go 并登录之前注册的账号

安卓手机可以到谷歌市场下载 Expo go，但是不知道为什么，下载的速度太慢了。所以我这里提供网页端下载。 https://expo.dev/go 选择最新版下载安装就行了

5、本地 eas-cli 登录

npx eas login

输入账号密码登录

6、安装依赖运行 Metro 使用 expo go 调试

yarn start

同 wifi 环境上使用 expo go 扫描终端中的二维码进行 expo go 调试

或者通过终端的快捷键在 expo go 中进行调试

7、原生调试（原生调试需要原生开发环境）

npx expo run:ios

npx expo run:android

使用 npx expo prebuild 进行预构建会生成原生 android / ios 目录，原生目录是用来原生调试使用的，在 window 系统下进行预构建无法生成 ios 原生目录（iOS 项目依赖 Xcode，Xcode 是 macOS 上的开发工具，用于处理 iOS 应用的构建、签名和发布。在 Windows 系统上，缺少 Xcode，因此无法生成和管理 iOS 项目）

8、安装第三方依赖注意事项

安装第三方依赖如果依赖涉及到原生交互，最好使用 npx expo install xxx（如：npx expo install react-native-mmkv），因为使用 expo install xxx 会确保安装与当前 Expo SDK 兼容的依赖版本（坑：有很多依赖是不能在 expo go 中启动的，比如 react-native-mmkv，所以如果使用依赖之后报错要看下其社区是不是不支持 expo go 中运行）

9、expo-dev-client 调试

原生模块（Native Modules）需要与应用程序的原生代码部分（如 iOS 的 Objective-C/Swift 和 Android 的 Java/Kotlin）进行链接。这意味着：1、当你在 React Native 项目中使用自定义的原生包时，必须通过工具（如 react-native link 或自动链接）将原生代码集成到应用的构建流程中。2、然而，Expo Go 是一个预编译的应用程序，无法动态加载新的原生模块。

安装 expo-dev-client 依赖：npx expo install expo-dev-client

配置 eas.json 的 build.development.developmentClient 属性为 true

打包开发 app： npx eas build --platform android --profile development

到 expo 的 eas 工作流中使用 expo go 或者直接下载开发 app

yarn start 启动项目后打开下载的开发 app，应用就会自动连接上本地项目上，就可以进行开发调试了（前提是在同一网络环境下）

使用 expo go 进行开发调试缺点就是只能使用 Expo SDK 中预先集成的模块和一些符合 Expo 工作流的第三方包。Expo Go 是一个专门为快速开发和原型制作而设计的客户端，它预先包含了常用的原生模块，但不支持使用未包含的原生模块，但是 expo-dev-client 解决了不能使用的一些 react-native 原生包的问题，但是前提是预先把这些包安装到 package.json 中，使用 eas 进行开发 app 的打包，再将开发 app 下载到设备上，这样 react-native 原生包才能正常使用

三种开发调试方式的区别：

| 调试方式                 | 是否能使用原生包 | 是否需要原生环境 | 是否需要使用 expo go 应用 |
| ------------------------ | ---------------- | ---------------- | ------------------------- |
| 原生开发调试             | 是               | 是               | 否                        |
| expo go 开发调试         | 否               | 否               | 是                        |
| expo-dev-client 开发调试 | 是               | 否               | 否                        |

10、打包配置

由于打包 ios 和 android 是使用 eas 云打包，所以需要在 expo 账号环境变量中增加不同环境的环境变量：

目前区分三个环境：

1、development（开发环境，打包开发 app 时读取）

2、preview（预览环境，充当测试环境使用）

3、production（生产环境，打包正式上线包使用）

web 打包无需使用 eas 云打包，所以是读取本地的.env 配置文件，打包命令读取不同的配置文件（这里要悉知 .env 配置文件加载优先级）

环境变量的读取有坑：（每个环境变量都必须使用 JavaScript 的点表示法静态引用为 process.env 的属性，才能内联。例如，表达式 process.env.EXPO_PUBLIC_KEY 有效并且将被内联；不支持表达式的替代版本。例如，process.env[\'EXPO_PUBLIC_KEY\'] 或 const {EXPO_PUBLIC_X} = process.env 无效，不会被内联）

11、理解版本号

# Expo 应用版本管理指南

在 Expo 项目中，`version` 和平台特定的 `android.versionCode` 与 `ios.buildNumber` 都是用于管理应用程序版本的，但它们的用途和定义有所不同：

---

## **1. `version` (通用版本号)**

- **用途**: 表示应用程序的通用版本号，通常是用户可见的。
- **格式**: 通常是 `major.minor.patch` 的形式，例如 `1.0.0`。
- **显示位置**: 这个版本号会显示在应用商店中（如 App Store 或 Google Play），让用户知道应用的版本。
- **修改时机**:
  - 当有新功能或显著更新时，可以增加主版本号。
  - 当进行小的功能改动时，可以增加次版本号。
  - 当修复了小问题或 bug 时，可以增加补丁号。
- **配置路径**: `app.json` 或 `app.config.js` 中。

```json
{
  "expo": {
    "version": "1.0.0"
  }
}
```

---

## **2. `android.versionCode` (Android 专用内部版本号)**

- **用途**:
  - 用于标识 Android 应用的唯一版本。
  - 应用商店通过 `versionCode` 判断版本是否比之前发布的版本更新。
- **格式**: 必须是一个 **递增的整数**，例如 `1`, `2`, `3`。
- **重要点**:
  - 不能重复或降低，必须每次发布新版本时增加。
  - 不直接展示给用户，主要用于内部管理。
- **配置路径**:

```json
{
  "expo": {
    "android": {
      "versionCode": 1
    }
  }
}
```

---

## **3. `ios.buildNumber` (iOS 专用内部构建编号)**

- **用途**:
  - 用于标识 iOS 应用的唯一构建。
  - App Store Connect 会通过 `buildNumber` 来判断是否是一个新版本。
- **格式**: 通常是字符串，通常用整数表示，例如 `1`, `2`, `3`。
- **重要点**:
  - 必须每次发布新版本时递增。
  - 不直接展示给用户，主要用于内部管理。
- **配置路径**:

```json
{
  "expo": {
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

---

## **总结: 主要区别**

| 属性                  | 平台    | 用途                                    | 格式        | 是否用户可见 |
| --------------------- | ------- | --------------------------------------- | ----------- | ------------ |
| `version`             | 通用    | 标识用户可见的应用版本                  | `1.0.0`     | 是           |
| `android.versionCode` | Android | 标识应用在 Google Play 的内部版本号     | 整数        | 否           |
| `ios.buildNumber`     | iOS     | 标识应用在 App Store Connect 的内部构建 | 字符串/整数 | 否           |

---

## **建议使用规范**

1. 每次发布新版本：
   - 增加 `version`，同时更新用户可见的版本号。
   - **确保** `android.versionCode` 和 `ios.buildNumber` 都递增。
2. 使用脚本或自动化工具（如 GitHub Actions）来管理版本号变化。

12、增量更新（目前使用方案是 expo 官方的 expo-updates 和官方的 EAS Updates 工作流）

expo-updates 还支持自定义更新服务，但是需要符合 Expo Updates 的规范，它是一种向在多个平台上运行的 Expo 应用程序提供更新的[协议](https://docs.expo.dev/technical-specs/expo-updates-1/)

配置：

```bash
# eas-cli是从终端与 EAS 服务交互的命令行应用程序
npm install --global eas-cli

# 登录到自己的expo账号
eas login

# 下载依赖包
npx expo install expo-updates

# 自动添加一些配置（runtimeVersion updates.url extra.eas.projectId等）
eas update:configure
# 修改app.json配置文件（eas update:configure之后默认是使用"runtimeVersion": { "policy": "appVersion" }，表示使用应用的版本号（app.json 中的 version 字段）作为 runtimeVersion，我们这里改成手动控制）
# {
#   "expo":{
#     "runtimeVersion": "1.0.0",
#     "updates": {
#       "url": "https://u.expo.dev/xxx"
#     }
#   }
# }
```

使用：

expo go 中是不支持 expo-updates 的，所以需要判断检测时机

```tsx
import Constants from "expo-constants";
import * as Updates from "expo-updates";

/** 检测函数 */
async function onFetchUpdateAsync() {
  // 独立运行时（你通过 expo build 或 eas build 构建了独立应用（APK 或 IPA）、用户从应用商店或直接安装包安装并运行应用）才检查更新
  if (Constants.executionEnvironment === "standalone") {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }
}

useEffect(() => {
  /** 检测 */
  onFetchUpdateAsync();
}, []);
```

发布：

```bash
# 发布新版本的前提是需要新建branch 和 channel，然后互相关联
# 发布新版本需要修改runtimeVersion的版本
eas update --channel [channel-name] --message "[message]"

# package.json中我写了update:dev/pre/prod脚本来区分渠道，一个渠道对应一个环境
yarn run update:pre --message="test expo-update"
```
