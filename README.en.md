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

### React example (ClassIn-like layout)

Full example: [examples/react/](./examples/react) (entry `index.html`, logic split into modules)

The UI is built with React: the whole interface (top bar included) is laid out as a 16:9 stage fitted into the window (letterboxed); the dark blackboard scrolls vertically (wheel / dragging the scrollbar / middle-button drag); the toolbar floats on one side of the blackboard as a single column of icons and can be collapsed (the collapse button only appears while you hover the toolbar and follows the pointer vertically), with stroke / fill / line width in a flyout on hover or click — both stroke and fill can be set to “transparent”; when the cameras are docked to the right edge the toolbar moves over to the left. Several camera windows float over the blackboard (docked by default as one centred row of thumbnails — double-click a thumbnail to maximize it into the free area and double-click another to split that area; you can also drag a window onto the dock strip or let it float / resize / minimize / close) and the top-bar “windows” menu manages them all.

The code is split by responsibility, using plain `import` / `export` like a normal project:

| File | Contents |
| --- | --- |
| `index.html` | Page shell + the no-build module loader (React / Babel standalone from a CDN) |
| `main.jsx` | Entry: renders `<App />` |
| `App.jsx` | Application state and composition: stage, board, top bar, toolbar, camera layer |
| `constants.js` | Design size, tools / colors / widths, camera constants, the “transparent” value |
| `hooks.js` | `useWriteboard` (board lifecycle + event sync) and `useElementSize` |
| `icons.jsx` / `deps.js` | Icon component / shared dependency re-exports (React globals + writeboard ESM) |
| `ui/Toolbar.jsx` | Floating toolbar + the stroke / fill / width flyout |
| `ui/WindowMenu.jsx` | Top-bar “windows” menu (add / close windows, dock edge, alignment, placement) |
| `ui/PageOverlay.jsx`, `ui/BoardScrollbar.jsx` | Page dividers / page number / empty hint, and the edge-hugging scrollbar |
| `camera/CameraLayer.jsx` | Camera window layer: drag-to-dock, click-to-raise, double-click maximize and splitting |
| `camera/CameraWindow.jsx` | A single camera window (video / placeholder + header + 8-way handles) |
| `camera/dock.js` | Dock edge / alignment enums, size conversion, dock strip and hit test |
| `camera/distribution.js` | Free-area and equal-split maths (mirrors the demo's `get_distributions.ts`) |
| `styles.css` | All styles |

There is no build step: a small loader in `index.html` fetches each module and hands it to Babel standalone, which turns JSX and `import` into CommonJS and executes the graph in dependency order — so the source can be modular without a bundler (for production, use Vite / Rollup / esbuild instead).

To run it, serve the repository root with any static server (e.g. `npx serve` or `python -m http.server`) and open `examples/react/index.html` (it must be served over http — `fetch` of the modules is blocked on `file://`).

Things to know when integrating with React:

- **Lifecycle**: create the board in an effect and call `board.destroy()` on cleanup, so no canvas is left behind after a hot reload / unmount.

  ```jsx
  useEffect(() => {
    const el = containerRef.current
    const factory = Gaia.factory(FactoryEnum.Default)()
    const board = factory.newBoard({
      element: el,
      width: el.clientWidth,               // viewport = container size
      height: el.clientHeight,
      scrollWidth: el.clientWidth,
      scrollHeight: el.clientHeight * 3,   // world = 3x height -> the board scrolls
    })
    setBoard(board)
    return () => board.destroy()
  }, [containerRef])
  ```

- **Scrolling**: the board scrolls whenever its world is larger than the viewport (the wheel is handled inside the board; the example intercepts it and converts the delta by the canvas scale before calling `scroll_by`); `board.scroll_to()` / `board.scroll_by()` move the viewport programmatically, and `EventEnum.WorldRectChanged` / `EventEnum.ViewportChanged` sync the scroll state back to React (the scrollbar, page number and page dividers in the example are drawn from that state, and the scrollbar hugs the right edge of the board).
- **Canvas scaling (strokes follow the window)**: the canvas is always drawn at a fixed design size (`DESIGN_W × DESIGN_H`) and the element is then stretched over the blackboard rectangle with `transform: scale(kx, ky)` — the same trick as gim.ink's `views_solution_demo`. Strokes, text and everything already drawn live in design coordinates, so they keep their size and position relative to the blackboard rectangle no matter how the window is resized; `board.map2world()` divides by `canvas.width / rect.width`, so pointer coordinates stay accurate after scaling.
- **Styles**: the stroke color / width and the fill color live on shape templates (`board.factory.shapeTemplate(type)`); every shape created afterwards picks them up. Shapes whose `needFill` is true (rectangle / oval) also take a fill, and both stroke and fill accept “transparent” (just pass canvas’ `'transparent'`, i.e. no stroke / no fill). The numbers in the flyout are “reference size” values, multiplied by `DESIGN_K` when written to the 1.5× design canvas (the eraser indicator too), which keeps the visual thickness unchanged.
- **16:9 stage**: `.app` keeps the aspect ratio with `width: min(100vw, 100vh * 16 / 9); height: min(100vh, 100vw * 9 / 16)` (top bar included); the blackboard sits flush under the top bar with no padding so the writing area is as large as possible, and the floating windows / toolbar are sized from the board (`--u: clamp(.8px, calc(100cqi / 1280), 1.5px)` plus ratio-based geometry), so they always keep the same size relative to the board.
- **Window management**: there can be several camera windows (add / close them from the “windows” menu, up to 8), with the same three placements as `ViewsSolution` in blogim Chatroom:
  - **Docked**: the thumbnails line up along the dock strip of the configured edge (size = standard size × `CAM_DOCK_SCALE`, flush, no drop shadow, just a 1px outline) and the row is aligned to the start / centre / end of that edge — mirroring the demo's `get_horizontal/vertical_distribution`. The dock edge and alignment come from the “windows” menu (`DockType` / `DockAlign`); while dragging, **only the configured dock edge is offered as a dock strip** (docking is not decided by which edge you happen to drag near) and a window docks only when its centre enters that strip, exactly like `should_dock` in the demo.
  - **Maximized**: double-clicking a thumbnail (or a window's header) fills the **free area** (= the whole board minus the dock strip, or the whole board when nothing is docked), and several maximized windows share that area — mirroring the demo's `get_fill_distribution`: one fills it, two split it into columns, three become three columns, four become a 2×2 grid, five become 2 + 3, eight become 4 columns × 2 rows. **When several windows are floating they are maximized together** (and split the free area between them); docked thumbnails and minimized windows are left alone. Dropping a window in the free area while others are already maximized adds it to that grid.
  - **Floating**: a floating window keeps its own size and position (stored as board fractions, so it scales with the board) and has **8 directional resize handles** (left / right / top / bottom + four corners, mirroring the demo's `resizer_l/r/t/b/lt/rt/lb/rb`). Docked / maximized / minimized sizes come from the layout, so the handles are only shown on floating windows.
  - **Minimized**: collapses into a pill in the bottom-left corner; clicking it restores the previous placement.
  - Chrome inside a window is sized as stage units × that window's own scale (`--wu: calc(var(--u) * var(--ws))`), so the header, buttons and labels shrink together inside a docked thumbnail; the thumbnail's header is hidden until you hover it.
- **Toolbar**: floats on one side of the blackboard as a single column of icons (tools / undo-redo / clear — paging is done with the wheel, the scrollbar or middle-drag) and scales with `--u` like everything else; the whole bar collapses into a small round rail. The collapse button is hidden by default — it only appears at the **middle of the board-facing edge** (`top: 50%`) while the toolbar is hovered; it sits flush against the bar and has a 420ms hide delay, so moving the pointer from the bar onto the button never makes it disappear mid-way, and the style flyout leaves room for it.
- **Toolbar side switching**: when the dock edge is set to “right”, the toolbar (and its collapse button, icon direction and style flyout) moves to the left side via `.toolbar.side-left`, so it never competes with the camera thumbnails.
- **Dark board and the text editor**: the example writes the current color to the container's `color` / `caret-color` and hides the textarea text with `color: transparent` — the glyphs are painted on the canvas, while the textarea only handles input and the caret, so the color always matches.
- **Undo / redo**: `new ActionQueue().setActor(board)` then call `undo()` / `redo()`; use `canUndo` / `canRedo` to enable or disable the buttons.

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
