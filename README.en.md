# writeboard

[简体中文](./README.md) | English

## Introduction

An extensible whiteboard for writing, with zero runtime dependencies.

DEMO: [https://writeboard.gim.ink/](https://writeboard.gim.ink)

## Installation

``` shell
npm install --save @fimagine/writeboard
```

## Usage

### Import the stylesheet and prepare the container

The canvas layer is absolutely positioned, so: ① import the stylesheet shipped in the package; ② keep the container `position: relative`.

``` javascript
import "@fimagine/writeboard/dist/es6/cjs/writeboard.css"
```

``` css
#container {
  position: relative; /* required: the canvas layer is positioned against it */
  width: 500px;
  height: 500px;
}
```

### Simplest example

Full example: [examples/simplest/index.html](https://github.com/gimhol/writeboard/blob/main/examples/simplest/index.html)

The code below is exactly what the example does (the example additionally draws a row of tool-switching buttons from `ToolEnum`):

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

Notes:

- The `import` above uses a relative path to the build output inside this repo; when installed from npm, import from `"@fimagine/writeboard"` instead, and add the stylesheet plus the `position: relative` container shown in the section above.
- In TypeScript, `document.getElementById('container')` returns `HTMLElement | null`, so write `document.getElementById('container')!`.

### React example (online classroom)

The complete React example for an online classroom (a 16:9 stage, a dark scrollable blackboard, a collapsible floating toolbar, and several camera / draft windows that can be docked, floated, maximized or minimized; the window part is a framework-free *solution* plus a React *bridge*, mirroring `ViewsSolution`) now lives as the standalone `classroom2` project (Vite + React + TypeScript) and is no longer shipped with this repository.

### No bundler

The same three steps without a bundler and without this repo: save the following as `index.html` and open it in a browser (script and stylesheet are loaded from CDN).

``` html
<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0 user-scalable=no">
  <link rel="stylesheet" href="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.css">
  <style>
    #container {
      position: relative; /* required: the canvas layer is positioned against it */
      width: 500px;
      height: 500px;
    }
  </style>
</head>

<body>
  <div id="container"></div>

  <script src="https://unpkg.com/@fimagine/writeboard@0.2.0/dist/es6/umd/writeboard.js"></script>
  <script>
    const { Gaia, FactoryEnum, ToolEnum } = writeboard; // UMD global

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

## Documentation

Simplified Chinese is the default; English versions live in the matching `.en.md` files.

| Doc | 简体中文 |
|---|---|
| [docs/](./docs/README.en.md) Docs index: core concepts and the registry API cheat-sheet | [docs/README.md](./docs/README.md) |
| [docs/custom-shape.en.md](./docs/custom-shape.en.md) Custom shape: `ShapeData` + `Shape`, with full triangle/star examples and gotchas | [docs/custom-shape.md](./docs/custom-shape.md) |
| [docs/custom-tool.en.md](./docs/custom-tool.en.md) Custom tool: `ITool` / `SimpleTool`, pointer coordinates, undo/redo and recording | [docs/custom-tool.md](./docs/custom-tool.md) |
| [docs/recording.en.md](./docs/recording.en.md) Recording & playback: `Recorder` / `Player`, speed, progress bar, pause, seeking and legacy migration | [docs/recording.md](./docs/recording.md) |

## Development

``` shell
npm install        # install dependencies
npm run build      # build the library bundles into dist/
npm test           # build & run unit tests
npm start          # build the demo into output/ in watch mode
npm run doc        # generate typedoc
```

## Contributing

1. fork.
2. new branch: feat/xxx, fix/xxx
3. commit & push
4. pull Request
