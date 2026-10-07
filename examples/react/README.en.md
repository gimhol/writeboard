# writeboard React example

[简体中文](./README.md) | English

A complete example with a ClassIn-like layout: a 16:9 stage, a dark scrollable blackboard, a collapsible floating toolbar, and several camera / draft windows that can be **docked / floating / maximized / minimized**. The window part is deliberately split into a *solution* and a *bridge*, mirroring `ViewsSolution/Solution.ts` + `Bridging_HTMLElement.tsx` in the production code base.

- For the library itself, see the [root README](../../README.en.md) and [docs/](../../docs/README.en.md).
- Everything about this example (UI, windows, drag rules, the no-build loader and the React integration notes) lives in this file.

## Running it

Serve the repository root with any static server (e.g. `npx serve` or `python -m http.server`) and open `examples/react/index.html` (it must be served over http — `fetch` of the modules is blocked on `file://`).

## The UI

The UI is built with React: the whole interface (top bar included) is laid out as a 16:9 stage fitted into the window (letterboxed); the dark blackboard scrolls vertically (wheel / dragging the scrollbar / middle-button drag); the toolbar floats on one side of the blackboard as a single column of icons and can be collapsed (the collapse button only appears while you hover the toolbar and follows the pointer vertically), with stroke / fill / line width in a flyout on hover or click — both stroke and fill can be set to “transparent”; when the cameras are docked to the right edge the toolbar moves over to the left. Several camera windows float over the blackboard (docked by default as one centred row of thumbnails — double-click a thumbnail to maximize it into the free area and double-click another to split that area; you can also drag a window onto the dock strip or let it float / resize / minimize / close) and the top-bar “windows” menu manages them all. Besides cameras you can add “draft” windows: each one holds another blackboard (600×400 at the 1280×720 reference size, 3 pages, scrollable with the wheel or the scrollbar) that you can write on directly — the contents are scaled uniformly and centred, so no amount of resizing, docking or maximizing deforms the strokes.

## Code layout

The code is split by responsibility, using plain `import` / `export` like a normal project:

| File | Contents |
| --- | --- |
| `index.html` | Page shell + the no-build module loader (React / Babel standalone from a CDN) |
| `main.jsx` | Entry: renders `<App />` |
| `App.jsx` | Application state and composition: stage, board, top bar, toolbar, camera layer |
| `constants.js` | Design size, tools / colors / widths, the “transparent” value |
| `hooks.js` | `useWriteboard` (board lifecycle + event sync), `useElementSize`, `useBoardStyle` / `useBoardTool` (toolbar style and tool sync, shared by the main board and drafts) |
| `icons.jsx` / `deps.js` | Icon component / shared dependency re-exports (React globals + writeboard ESM) |
| `ui/Toolbar.jsx` | Floating toolbar + the stroke / fill / width flyout |
| `ui/WindowMenu.jsx` | Top-bar “windows” menu (add camera / draft windows, close, dock edge, alignment, placement) |
| `ui/PageOverlay.jsx`, `ui/BoardScrollbar.jsx` | Page dividers / page number / empty hint, and the edge-hugging scrollbar |
| `views/config.js` | Window config: kinds (camera / draft), placements, default dock edge / alignment, per-kind default size ratios |
| `views/solution.js` | **ViewSolution**: window list, kinds, placements, dock strip / free area, drag and resize state machine (no React / DOM) |
| `views/use-solution.js` | The React bridge: `useSolution` (`useSyncExternalStore` on the solution) + `trackPointer` |
| `views/ViewLayer.jsx` | View layer: renders the rects the solution computes and feeds pointer events back into it |
| `views/ViewWindow.jsx` | The shell of a single window (header icon and body picked by kind, 8-way handles) |
| `views/CameraBody.jsx` | Camera window contents: video + placeholder when the camera is off |
| `views/DraftBoard.jsx` | Draft window contents: a separate writeboard (600×400 × 3 pages) that scales with the window |
| `views/dock.js` | Dock edge / alignment enums, size conversion, dock strip and hit test |
| `views/distribution.js` | Free-area and equal-split maths (mirrors the demo's `get_distributions.ts`) |
| `styles.css` | All styles |

The windows are deliberately split into a *solution* and a *bridge*, mirroring `ViewsSolution/Solution.ts` + `Bridging_HTMLElement.tsx` in the production code base:

- `views/config.js` / `dock.js` / `distribution.js` / `solution.js` are plain, framework-free logic: no React import, no DOM access — the blackboard is just one `full` rect, and the solution derives every window rect, the dock strip and the free area while exposing `subscribe` / `setFrame` / `add` / `beginDrag` / `moveDrag` / `endDrag` / `beginResize` / `toggleMaximized` and friends.
- The render layer (`ViewLayer.jsx`) only does two things: draw `solution.rects` and feed pointer events back. React subscribes through `useSolution(solution)` (`useSyncExternalStore`), so no update between the first render and the subscription can be missed and no layout state is duplicated into React state.
- The payoff is a single source of truth for layout and interaction: `views/solution.js` can be imported and unit-tested straight from Node, and swapping the renderer (DOM / Canvas / Vue) only means writing another bridge.

## Windows

There are two kinds of window, both configured in `VIEW_KINDS` (`views/config.js`); default sizes are stored as **blackboard ratios**, so they keep their relative size whenever the board is resized:

| Kind | Default placement / size | Contents |
| --- | --- | --- |
| camera | docked in the strip, thumbnail = standard size × `CAM_DOCK_SCALE` | the picture (`CameraBody.jsx`): the video once the camera is on, otherwise a single icon placeholder (click it to start the camera; a failure turns it into a red slashed-camera icon — no text, no buttons); the name sits at the bottom of the picture. **No header / title icon / title**; the three actions float in the top-right corner: the layer is fully transparent and only fades in while you hover the window, and the buttons have no background of their own — only the button you hover lights up. The whole window is draggable and a double-click anywhere maximizes it |
| draft | floating at the centre, 600×400 at the 1280×720 reference size (3:2 — a floating draft window is locked to it) | another blackboard (`DraftBoard.jsx`, 600×400 × 3 pages, scrollable with the wheel or the scrollbar; the content is scaled **uniformly** and centred, so no window shape can deform the strokes); it keeps a header (title + the three buttons) purely as its drag handle |

**Only camera windows dock**: drag a camera into the strip (the test looks at the **pointer**, like the demo's `should_dock`), double-click a thumbnail to maximize it into the free area and double-click another to split that area. A draft stays floating or maximized — dropping it on the strip does nothing (and it can only be dragged by its header, so the body stays free for writing).

### The four placements

There can be several camera windows (add / close them from the “windows” menu, up to 8), with the same four placements as `ViewsSolution` in blogim Chatroom:

- **Docked**: the thumbnails line up along the dock strip of the configured edge (size = standard size × `CAM_DOCK_SCALE`, flush, no drop shadow, just a 1px outline) and the row is aligned to the start / centre / end of that edge — mirroring the demo's `get_horizontal/vertical_distribution`. The dock edge and alignment come from the “windows” menu (`DockType` / `DockAlign`); while dragging, only the configured dock edge is considered (docking is not decided by which edge you happen to drag near) and the test looks at the **pointer**, exactly like `should_dock` in the demo — which zone lights up and how brightly is described under “Drag feel” below.
- **Maximized**: double-clicking a thumbnail (or a window's header) fills the **free area** (= the whole board minus the dock strip, or the whole board when nothing is docked), and several maximized windows share that area — mirroring the demo's `get_fill_distribution`: one fills it, two split it into columns, three become three columns, four become a 2×2 grid, five become 2 + 3, eight become 4 columns × 2 rows. **When several windows are floating they are maximized together** (and split the free area between them); docked thumbnails and minimized windows are left alone. Dropping a window in the free area while others are already maximized adds it to that grid.
- **Floating**: a floating window keeps its own size and position (stored as board fractions, so it scales with the board) and has **8 directional resize handles** (left / right / top / bottom + four corners, mirroring the demo's `resizer_l/r/t/b/lt/rt/lb/rb`). Docked / maximized / minimized sizes come from the layout, so the handles are only shown on floating windows.
- **Minimized**: collapses into a pill; clicking one restores that window's previous placement. The pills line up in the bottom-left corner of the **free area** (the board minus the dock strip), so they never sit on top of the thumbnails whichever edge is docked.
- Chrome inside a window is sized as stage units × that window's own scale (`--wu: calc(var(--u) * var(--ws))`), so the header, buttons and labels shrink together inside a docked thumbnail.

### Drag feel

The drag feel is ported from the demo's `Solution.ts`:

- **Dragging while still in the strip**: the thumbnail slides along the strip with the pointer — full movement along the strip, only 10% of the movement perpendicular to it (damping), so it nudges rather than flying out; it keeps its thumbnail size.
- **Once the pointer leaves the strip**: the window returns to its standard size and then follows the pointer with a 60fps **eased follow** (half the distance per frame; snapped exactly on release).
- **Drop commit**: pointer still inside the strip → docked; started docked with the pointer in the free area → joins the maximize grid if anyone is already maximized, otherwise floats; started floating → simply stays where it was dropped.
- CSS transitions are disabled while dragging / resizing (the position is already computed per frame, a CSS transition on top would lag).
- **Which zone lights up, and how brightly** — taken from measuring the two indicators on the reference demo (`views_solution_demo`): dim = a hint, lit = this is where it lands, and only one zone is shown at a time.
  - Dragging a window that **lives in the dock strip**: **only the free area** is shown, and it stays dim while the pointer is still inside the strip (dropping it back in changes nothing) — move out of the strip and it lights up (the drop floats it, or joins an existing grid).
  - Dragging a **floating** window: **only the dock strip** is shown; it stays dim while the pointer is out in the free area (dropping it there just moves it) and lights up as the pointer enters the strip.
  - Drafts show neither (they can never dock, so where it lands makes no difference).
  - The drop preview is still drawn whenever the pointer is inside the strip, so the exact landing slot is obvious.
- Browsers also fire a trailing `click` after a drag (when the press and release share an ancestor); the example swallows it (`ViewSolution.afterDrag`) so dragging a window never counts as clicking a button or the camera placeholder inside it.

A docked thumbnail can be dragged out from anywhere on it and returns to the standard size while keeping the grabbed point under the pointer. Drag coordinates are converted to board coordinates before they reach `ViewSolution` — mixing screen and board coordinates offsets the dock hit test by the board's top-left. While a draft has focus, the top-bar undo / redo (and `Ctrl+Z` / `Ctrl+Y`) act on the draft's board, and clicking back onto the main blackboard switches it back.

## Toolbar and blackboard

- **Toolbar**: floats on one side of the blackboard as a single column of icons (tools / undo-redo / clear — paging is done with the wheel, the scrollbar or middle-drag) and scales with `--u` like everything else; the whole bar collapses into a small round rail. The collapse button is hidden by default — it only appears while the toolbar is hovered, its Y **follows the pointer** (clamped to the toolbar's height, and it stops moving while the pointer is over the button), it sits flush against the bar and has a 420ms hide delay, so moving the pointer from the bar onto the button never makes it disappear mid-way, and the style flyout leaves room for it.
- **Toolbar side switching**: when the dock edge is set to “right”, the toolbar (and its collapse button, icon direction and style flyout) moves to the left side via `.toolbar.side-left`, so it never competes with the camera thumbnails.
- **Dark board and the text editor**: the example writes the current color to the container's `color` / `caret-color` and hides the textarea text with `color: transparent` — the glyphs are painted on the canvas, while the textarea only handles input and the caret, so the color always matches.
- **Selecting text**: `.app` turns `user-select` off (the top bar, window titles, toolbar and hints are UI chrome — dragging over them should not highlight anything) and only re-enables it for `input` / `textarea` / `[contenteditable]` — the text tool uses a `textarea` created by the library, so words on the board can still be selected and copied.
- **16:9 stage**: `.app` keeps the aspect ratio with `width: min(100vw, 100vh * 16 / 9); height: min(100vh, 100vw * 9 / 16)` (top bar included); the blackboard sits flush under the top bar with no padding so the writing area is as large as possible, and the floating windows / toolbar are sized from the board (`--u: clamp(.8px, calc(100cqi / 1280), 1.5px)` plus ratio-based geometry), so they always keep the same size relative to the board.

## The no-build loader

There is no build step: a small loader in `index.html` fetches each module (with `cache: 'no-store'`) and hands it to Babel standalone, which turns JSX and `import` into CommonJS and executes the graph in dependency order — so the source can be modular without a bundler. The stylesheets get a timestamp as well (`?v=`) so that after editing the CSS a refresh never keeps serving a stale cached copy (for production, use Vite / Rollup / esbuild instead).

## Things to know when integrating with React

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
- **Undo / redo**: `new ActionQueue().setActor(board)` then call `undo()` / `redo()`; use `canUndo` / `canRedo` to enable or disable the buttons.
