# writeboard

简体中文 | [English](./README.en.md)

## 介绍

可扩展的书写用白板，不依赖任何第三方库。

DEMO：[https://writeboard.gim.ink/](https://writeboard.gim.ink)

## 安装

``` shell
npm install --save @fimagine/writeboard
```

## 使用说明

### 引入样式与准备容器

板子的画布层是绝对定位的，所以：① 需要引入包内样式；② 容器要保持 `position: relative`。

``` javascript
import "@fimagine/writeboard/dist/es6/cjs/writeboard.css"
```

``` css
#container {
  position: relative; /* 必须：画布层相对容器定位 */
  width: 500px;
  height: 500px;
}
```

### 最简示例

完整示例：[examples/simplest/index.html](https://github.com/gimhol/writeboard/blob/main/examples/simplest/index.html)

下面就是该示例中的代码（示例还额外用 `ToolEnum` 生成了一排工具切换按钮）：

``` javascript
import { Gaia, FactoryEnum, ToolEnum } from "../lib/writeboard.js"

// 步骤1：创建一个默认工厂
// step 1: create a factory.
const factory = Gaia.factory(FactoryEnum.Default)();

// 步骤2：通过工厂创建一个“板子”
// step 2: create board in container element.
const board = factory.newBoard({
  element: document.getElementById('container'),
  width: 500,
  height: 500,
});

// 切换到内置工具“笔”，然后你就可以在“板子”上画东西了
// switch to built-in tool "pen", then you can draw something on board.
board.setToolType(ToolEnum.Pen);
```

使用注意：

- 示例中的 `import` 是相对路径，指向仓库内的构建产物；通过 npm 安装后请改成从包导入：`import { Gaia, FactoryEnum, ToolEnum } from "@fimagine/writeboard"`，并按上一节引入样式、让容器保持 `position: relative`。
- TypeScript 中 `document.getElementById('container')` 返回 `HTMLElement | null`，可写成 `document.getElementById('container')!`。

### React 示例

完整示例：[examples/react/](./examples/react) —— 仿 ClassIn 布局：16:9 舞台、深色可滚动黑板、可收起的悬浮工具栏，以及多个可以停靠 / 悬浮 / 最大化 / 最小化的摄像头窗口与草稿窗口（窗口那部分是「纯方案 + React 桥接」两层，结构照 `ViewsSolution` 写的）。

- 示例自己的说明（模块表、窗口与拖动规则、免构建加载器、与 React 集成的注意点）：[examples/react/README.md](./examples/react/README.md)（[English](./examples/react/README.en.md)）
- 运行：在仓库根目录起一个静态服务器（`npx serve`、`python -m http.server` 等），打开 `examples/react/index.html`（要用 http 打开，`file://` 下 fetch 模块会被浏览器拦掉）。

### 不用打包器

同样三步、但不需要打包器、也不需要本仓库的版本：把下面的内容保存为 `index.html`，直接用浏览器打开即可（脚本与样式从 CDN 加载）。

``` html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.css">
  <style>
    #container {
      position: relative; /* 必须：画布层相对容器定位 */
      width: 500px;
      height: 500px;
    }
  </style>
</head>

<body>
  <div id="container"></div>

  <script src="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.js"></script>
  <script>
    const { Gaia, FactoryEnum, ToolEnum } = writeboard; // UMD 全局变量

    const factory = Gaia.factory(FactoryEnum.Default)();
    const board = factory.newBoard({
      element: document.getElementById('container'),
      width: 500,
      height: 500,
    });
    board.setToolType(ToolEnum.Pen);
  </script>
</body>

</html>
```

## 文档

默认简体中文，英文版为同名的 `.en.md`。

| 文档 | English |
|---|---|
| [docs/](./docs/README.md) 文档目录：核心概念与注册 API 速查 | [docs/README.en.md](./docs/README.en.md) |
| [docs/custom-shape.md](./docs/custom-shape.md) 自定义图形：`ShapeData` + `Shape`，含三角形/星形完整示例与常见坑 | [docs/custom-shape.en.md](./docs/custom-shape.en.md) |
| [docs/custom-tool.md](./docs/custom-tool.md) 自定义工具：`ITool` / `SimpleTool`，指针坐标、撤销重做与录制回放 | [docs/custom-tool.en.md](./docs/custom-tool.en.md) |
| [docs/recording.md](./docs/recording.md) 录制与回放：`Recorder` / `Player`，倍速、进度条、暂停、跳转与旧剧本迁移 | [docs/recording.en.md](./docs/recording.en.md) |

## 开发

``` shell
npm install        # 安装依赖
npm run build      # 构建 dist/ 下的库产物
npm test           # 构建后运行单测
npm start          # 以 watch 模式构建 demo 到 output/
npm run doc        # 生成 typedoc
```

## 参与贡献

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
