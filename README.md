# writeboard

## 介绍 Instruction

可扩展的书写用白板，不依赖任何第三方库。

Extensible whiteboard for writing with minimal reliance on third-party libraries.

DEMO：[https://writeboard.gim.ink/](https://writeboard.gim.ink)

## 安装教程 Installation

``` shell
npm install --save @fimagine/writeboard
```

## 使用说明 Usage

### 引入样式 Import the stylesheet

板子的画布布局依赖包内的样式文件，使用前请引入：

The canvas layout relies on the stylesheet shipped in the package, import it before use:

``` javascript
import "@fimagine/writeboard/dist/es6/cjs/writeboard.css"
```

### 最简示例 Simplest Example

[simplest](https://github.com/gimhol/writeboard/blob/main/examples/simplest/index.html)

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

## 开发 Development

``` shell
npm install        # 安装依赖 install dependencies
npm run build      # 构建 dist/ 下的库产物 build library bundles into dist/
npm test           # 构建后运行单测 build & run unit tests
npm start          # 以 watch 模式构建 demo 到 output/ build demo into output/ in watch mode
npm run doc        # 生成 typedoc generate typedoc
```

## 参与贡献 Participate

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
