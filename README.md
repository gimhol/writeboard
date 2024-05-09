# writeboard

#### 介绍 Instruction

可扩展的书写用白板，不依赖任何第三方库。

Extensible whiteboard for writing with minimal reliance on third-party libraries.

DEMO：[https://writeboard.gim.ink/](https://writeboard.gim.ink)

#### 安装教程 Installation

```
npm install --save writeboard
```

#### 使用说明 Usage

```js
import { WhiteBoard } from 'writeboard'

const whiteBoardWidth = 500;
const whiteBoardHeight = 500;

/**
 * @type {HTMLCanvasElement}
 */
const onscreenCanvas = document.getElementById("on-screen-canvas");
onscreenCanvas.width = whiteBoardWidth;
onscreenCanvas.height = whiteBoardHeight;

/**
 * @type {HTMLCanvasElement}
 */
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = onscreenCanvas.width;
offscreenCanvas.height = onscreenCanvas.height;

const factory = FactoryMgr.createFactory(FactoryEnum.Default);
const whiteboard = factory.newWhiteBoard({
  onscreen: onscreenCanvas,
  offscreenCanvas: offscreenCanvas
});

```

#### 参与贡献 Participate

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
