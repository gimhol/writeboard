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

### 最简示例 Simplest Example

``` javascript
import { Gaia, FactoryEnum, ToolEnum } from '@fimagine/writeboard'

// 步骤1：创建一个默认工厂
// step 1: create a factory.
const factory = Gaia.factory(FactoryEnum.Default)();

// 步骤2：通过工厂创建一个“板子”
// step 2: create board in container element.
const board = factory.newBoard({
  element: document.getElementById('container'),
  width: 500;
  height: 500;
});

// 切换到内置工具“笔”，然后你就可以在“板子”上画东西了
// switch to built-in tool "pen", then you can draw something on board.
board.setToolType(ToolEnum.Pen);
```

## 参与贡献 Participate

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
