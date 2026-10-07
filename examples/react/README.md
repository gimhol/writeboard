# writeboard React 示例

简体中文 | [English](./README.en.md)

仿 ClassIn 布局的一个完整示例：16:9 舞台、深色可滚动的黑板、可收起的悬浮工具栏，以及多个能**停靠 / 悬浮 / 最大化 / 最小化**的「摄像头窗口」和「草稿窗口」。窗口那部分的布局与交互刻意做成「方案 + 桥接」两层，和生产代码里的 `ViewsSolution/Solution.ts` + `Bridging_HTMLElement.tsx` 一一对应。

- 库本身的用法请看仓库根目录的 [README](../../README.md) 与 [docs/](../../docs/README.md)。
- 跟示例有关的细节（界面、窗口、拖动规则、免构建加载器、与 React 集成的注意点）都写在这里。

## 运行

在仓库根目录起一个静态服务器（如 `npx serve` 或 `python -m http.server`），打开 `examples/react/index.html` 即可 —— 要用 http 打开，`file://` 下 fetch 模块会被浏览器拦掉。

## 界面

整个界面（含顶栏）按 16:9 等比铺在窗口里（多余部分留黑边），深色黑板可上下滚动（滚轮 / 拖动滚动条 / 中键拖拽）；工具栏浮在黑板侧边、只有一列图标、可以整体收起（鼠标移到工具栏上才冒出收起按钮，还会跟着鼠标上下走），描边 / 填充 / 粗细放在浮层里，只在 hover 或点击工具按钮时出现，描边与填充都能选「透明」；摄像头停在右侧时工具栏自动让到左侧。黑板上浮着多个「摄像头窗口」（默认停靠成顶部居中一排小画面，双击小画面就放大到自由区、再双击另一个就均分自由区，也能拖到停靠带停靠或自由悬浮 / 拉伸 / 最小化 / 关闭），顶栏的「窗口」菜单统一管理这些窗口。除了摄像头，还能随时添加「草稿窗口」：它里面是另一块黑板（1280×720 下默认 600×400，3 页，滚轮 / 滚动条可滚），可以直接在上面写；内容等比缩放居中，窗口怎么拉、怎么停靠、怎么最大化，笔迹都不会被拉变形。

## 代码组织

代码按职责分模块（和正常项目一样用 `import` / `export`）：

| 文件 | 内容 |
| --- | --- |
| `index.html` | 页面壳 + 免构建的模块加载器（CDN 引入 React / Babel standalone） |
| `main.jsx` | 入口：渲染 `<App />` |
| `App.jsx` | 应用状态与组合：舞台、黑板、顶栏、工具栏、摄像头窗口层 |
| `constants.js` | 设计尺寸、工具 / 颜色 / 粗细、「透明」等配置 |
| `hooks.js` | `useWriteboard`（板子生命周期 + 事件同步）、`useElementSize`、`useBoardStyle` / `useBoardTool`（工具栏样式与工具同步，主黑板和草稿共用） |
| `icons.jsx` / `deps.js` | 图标组件 / 依赖汇总（React 全局 + writeboard 的 ESM 导出） |
| `ui/Toolbar.jsx` | 悬浮工具栏 + 描边 / 填充 / 粗细浮层 |
| `ui/WindowMenu.jsx` | 顶栏「窗口」菜单（添加摄像头 / 草稿窗口、关闭、停靠边、对齐、形态） |
| `ui/PageOverlay.jsx`、`ui/BoardScrollbar.jsx` | 分页线 / 页码 / 空板提示、贴边滚动条 |
| `views/config.js` | 窗口配置：种类（摄像头 / 草稿）、形态、默认停靠边与对齐、各自的默认尺寸比例 |
| `views/solution.js` | **ViewSolution**：窗口列表、种类、形态、停靠带 / 自由区、拖动与拉伸的状态机（无 React / DOM 依赖） |
| `views/use-solution.js` | React 侧桥接：`useSolution`（`useSyncExternalStore` 订阅 solution）+ `trackPointer` 指针接线 |
| `views/ViewLayer.jsx` | 窗口层：只负责把 `solution` 的矩形画出来、把指针事件接给 `solution` |
| `views/ViewWindow.jsx` | 单个窗口的外壳（头栏按种类换图标、内容区按种类渲染、8 向把手） |
| `views/CameraBody.jsx` | 摄像头窗口的内容：视频 + 未开启时的占位 |
| `views/DraftBoard.jsx` | 草稿窗口的内容：一块独立的 writeboard（600×400 × 3 页），随窗口缩放 |
| `views/dock.js` | 停靠边 / 对齐枚举、尺寸换算、停靠带与命中判定 |
| `views/distribution.js` | 自由区与均分算法（对应 demo 的 `get_distributions.ts`） |
| `styles.css` | 全部样式 |

窗口这块刻意做成「方案 + 桥接」两层，和生产代码里的 `ViewsSolution/Solution.ts` + `Bridging_HTMLElement.tsx` 对应：

- `views/config.js` / `dock.js` / `distribution.js` / `solution.js` 是一组**纯粹的方案代码**：不引 React、不碰 DOM，只用一个 `full` 矩形描述黑板，算出每个窗口的矩形、停靠带与自由区，并对外提供 `subscribe` / `setFrame` / `add` / `beginDrag` / `moveDrag` / `endDrag` / `beginResize` / `toggleMaximized` 等方法。
- 渲染层（`ViewLayer.jsx`）只做两件事：把 `solution.rects` 画成窗口、把指针事件喂回 `solution`。React 里用 `useSolution(solution)`（`useSyncExternalStore`）订阅 —— 这样首帧到订阅之间不会漏事件，也不用把布局状态复制一份到 React state 里。
- 好处是布局与交互只有一处真源：Node 22.7+ 自带 module 语法探测（`.js` 里写 ESM 也能直接 import），所以可以直接 import `views/solution.js` 在 Node 里跑单测，换成 DOM / Canvas / Vue 渲染也只需要换桥接层。

## 窗口

窗口有两种，配置都在 `views/config.js` 的 `VIEW_KINDS` 里，默认尺寸一律记成**黑板比例**，所以黑板缩放时窗口相对大小不变：

| 种类 | 默认形态 / 尺寸 | 内容 |
| --- | --- | --- |
| 摄像头 | 停靠在停靠带，小画面 = 标准尺寸 × `CAM_DOCK_SCALE` | 画面（`CameraBody.jsx`）：开了摄像头放视频，没开就是一枚图标占位（点图标开启，打不开变红色带斜杠的图标，没有文字和按钮）；名字贴在画面底部。**没有头栏 / 标题图标 / 标题**，三个操作按钮浮在右上角：平时整层透明，鼠标移到窗口上才显形，按钮本身没有底色、只有 hover 到某一个上它才亮 —— 整块都能拖、双击画面就放大 |
| 草稿 | 悬浮在黑板中间，参考尺寸 1280×720 下是 600×400（3:2，悬浮时窗口就锁这个比例） | 另一块黑板（`DraftBoard.jsx`，600×400 × 3 页，滚轮 / 滚动条可滚；内容**等比**缩放并居中，窗口被拉成什么形状笔迹都不会变形）；保留头栏（标题 + 三个按钮）专门用来拖它 |

**只有摄像头窗口会停靠**：把摄像头拖进停靠带（判定看**指针**在不在带里，和 demo 的 `should_dock` 一致）、双击小画面放大、再双击另一个均分自由区；草稿窗口始终悬浮或最大化，拖到停靠带里也不会停靠（拖动只认头栏，正文留给写字）。

### 四种形态

摄像头窗口可以有好几个（「窗口」菜单里添加 / 关闭，最多 8 个），四种形态与 blogim Chatroom 的 `ViewsSolution` 一致：

- **停靠**：小画面沿「当前停靠边」的停靠带排成一行（尺寸 = 标准尺寸 × `CAM_DOCK_SCALE`，贴边不留间距、无投影，只有 1px 描边），整排按对齐方式居中 / 靠前 / 靠后 —— 对应 demo 的 `get_horizontal/vertical_distribution`；停靠边与对齐都由顶栏「窗口」菜单设定（对应 `DockType` / `DockAlign`），拖动时**只亮出当前停靠边这一条停靠带**（不是拖到哪条边算哪条边），窗口中心落进停靠带才停靠（和 demo 的 `should_dock` 一致）。
- **最大化**：双击小画面或窗口头栏就把窗口铺进**自由区**（= 整块黑板减去停靠带；没有窗口停靠时就是整块黑板），多个最大化窗口在自由区里均分 —— 对应 demo 的 `get_fill_distribution`：1 个铺满、2 个左右均分、3 个三列、4 个 2×2、5 个上行 2 个 + 下行 3 个、8 个 4 列 2 行。**有多个悬浮窗口时一起放大**（它们一起均分自由区），停靠的小画面与最小化的窗口不受影响；落进自由区松手时如果已经有人最大化，这个窗口也会一起加入拼接。
- **悬浮**：自持尺寸与位置（按黑板比例记，黑板怎么缩放它就跟到哪儿），窗口有 **8 个方向的拉伸把手**（左右上下 + 四角，对应 demo 的 `resizer_l/r/t/b/lt/rt/lb/rb`）；停靠 / 最大化 / 最小化的尺寸都由布局决定，所以把手只出现在悬浮窗口上。
- **最小化**：收成小胶囊，点在其中一个上就回到它原来的形态；这排胶囊排在**自由区**（已扣掉停靠带）的左下角，所以停靠边在上 / 下 / 左 / 右都不会被小画面压住。
- 窗口内部的控件尺寸 = 舞台单位 × 该窗口自己的缩放（`--wu: calc(var(--u) * var(--ws))`），所以停靠的小画面里，头栏 / 按钮 / 文字会一起缩小。

### 拖动的手感

拖动的细节是照 demo 的 `Solution.ts` 搬过来的：

- **停在停靠带里拖动**：小画面跟着指针「顺着带滑」—— 沿带方向跟满，垂直方向只走 10%（阻尼），所以看上去是在带里滑一下、不会立刻窜出去；尺寸仍是小画面尺寸。
- **拖出停靠带**（指针离开带）：回到该窗口自己的标准尺寸，之后位置由 60fps 的**缓动跟随**逐帧向指针靠拢（每帧走一半，松手时直接对齐）。
- **松手落点**：指针还在带里 → 停靠；原本停在带里、指针落在自由区 → 自由区里已经有人在拼接就加入拼接，否则悬浮；本来就悬浮的窗口则原地落定。
- 拖动 / 拉伸时窗口关掉 CSS 过渡（位置已经逐帧算好了，再叠一层过渡就拖手）。
- **亮哪一块、亮到什么程度** —— 照示例（`views_solution_demo`）上两个指示器的实测行为搬过来（暗 = 提示，亮 = 就是这里；同一时刻只显示一块）：
  - 拖**停靠带里**的窗口：**只显示自由区**；指针还在停靠带里时是**暗的**（回带里等于什么都没变），出了带就亮起来（松手会悬浮，已经有人在拼接就加入拼接）。
  - 拖**悬浮**的窗口：**只显示停靠带**；在自由区时是暗的（那里松手只是换个位置），指针进带才亮起来。
  - 草稿两边都不显示（它不能停靠，落哪儿都一样）。
  - 指针落在停靠带里时照旧画出落点预览（松手会落在哪个格子一目了然）。
- 拖完松手时浏览器还会补一个 `click`（按下与抬起有共同祖先就会补），示例把这个 click 吞掉（`ViewSolution.afterDrag`），所以拖窗口不会被画面里的按钮/占位当成「点了一下」（摄像头不会在拖动之后自己弹成「打不开」）。

停靠带里的小画面整个都能拖出来，拖出来回到标准尺寸、按下时抓住的那个点在指针下不跳。拖拽的坐标统一换算成黑板坐标后再交给 `ViewSolution`（屏幕坐标 / 黑板坐标混用会让停靠判定整块错位）。在草稿里按下时，顶栏的撤销 / 重做就作用于草稿那块板，点回主黑板再切回来（`Ctrl+Z` / `Ctrl+Y` 同理）。

## 工具栏与黑板

- **工具栏**：浮在黑板一侧，只有一列图标（工具 / 撤销重做 / 清空，翻页靠滚轮与滚动条），尺寸同样按 `--u` 等比缩放；整体可以收起成一个小圆钮。收起按钮平时不显示 —— 鼠标移到工具栏上才冒出来，而且它的 Y 会**跟着鼠标走**（夹在工具栏的高度范围内，鼠标停在按钮上时就不再移动），方便顺手点掉；它和工具栏之间不留缝，并有 420ms 的延时消失，鼠标从工具栏挪到按钮上不会半路消失；浮层的展开位置也会给它让出空间。
- **工具栏换边**：停靠边设为「右侧」时，工具栏与它的收起按钮一起让到黑板左侧（`.toolbar.side-left`，同时把样式浮层与箭头方向镜像过去），免得和摄像头小画面抢地方。
- **深色黑板与文本编辑框**：示例给容器写了当前颜色的 `color` / `caret-color`，再用 `color: transparent` 把文本编辑框（textarea）上的字隐掉 —— 文字由画布渲染，编辑框只负责输入与光标，颜色始终一致。
- **文字选中**：`.app` 上关掉 `user-select`（顶栏、窗口标题、工具栏、提示语这些只是界面文字，指针一划不该变蓝），只对 `input` / `textarea` / `[contenteditable]` 重新放开 —— 黑板上的文本工具用的是库自建的 `textarea`，所以照样能选词、复制。
- **16:9 舞台**：`.app` 用 `width: min(100vw, 100vh * 16 / 9); height: min(100vh, 100vw * 9 / 16)` 保持 16:9（含顶栏），黑板紧贴顶栏、不留内边距，书写区域尽可能大；窗口 / 工具栏的尺寸都按黑板比例算，所以舞台怎么缩放，它们相对黑板的大小都不变。

## 免构建的加载器

示例免构建：`index.html` 里有一小段加载器，用 fetch 取模块（`cache: 'no-store'`）、交给 Babel standalone 把 JSX 与 `import` 转成 CommonJS 再按依赖执行 —— 所以源码可以正常分模块，又不用打包器；样式表也顺手带了时间戳（`?v=`），免得改完 CSS 刷新后浏览器还在用缓存里的旧样式（生产项目请直接用 Vite / Rollup / esbuild）。

## 与 React 集成的几个要点

- **生命周期**：板子放在 effect 里创建，卸载时 `board.destroy()`，避免热更新 / 卸载后残留画布。

  ```jsx
  useEffect(() => {
    const el = containerRef.current
    const factory = Gaia.factory(FactoryEnum.Default)()
    const board = factory.newBoard({
      element: el,
      width: el.clientWidth,               // 可视区 = 容器大小
      height: el.clientHeight,
      scrollWidth: el.clientWidth,
      scrollHeight: el.clientHeight * 3,   // 世界 = 3 倍高度 → 板子可滚动
    })
    setBoard(board)
    return () => board.destroy()
  }, [containerRef])
  ```

- **滚动**：世界比可视区大即可滚动（滚轮由板子内部处理，示例里拦下来按画布缩放换算后调 `scroll_by`）；`board.scroll_to()` / `board.scroll_by()` 可编程移动可视区；滚动状态通过 `EventEnum.WorldRectChanged` / `EventEnum.ViewportChanged` 同步到 React 状态（示例中的滚动条、页码、分页线都是这么画的，滚动条贴着黑板右边缘摆）。
- **画布缩放（笔迹跟窗口走）**：画布固定按设计尺寸（`DESIGN_W × DESIGN_H`）绘制，外层元素再用 `transform: scale(kx, ky)` 铺满黑板矩形 —— 和 gim.ink 的 `views_solution_demo` 一样。这样笔迹、文字、已画内容都活在设计坐标里，窗口怎么缩放，它们相对黑板矩形的大小与位置都不变；`board.map2world()` 内部会用 `canvas.width / rect.width` 把指针坐标换算回设计坐标，所以缩放后落点依旧准确。
- **样式**：描边颜色 / 粗细 / 填充色都写在图形模板上（`board.factory.shapeTemplate(type)`），之后新建的图形即使用新样式；矩形 / 椭圆这类 `needFill` 为真的图形额外支持填充，描边与填充都能选「透明」（直接传画布认识的 `'transparent'` 即可，不描边 / 不填充）。面板上的粗细 / 字号是「参考尺寸」下的值，落到 1.5 倍的设计画布上要乘 `DESIGN_K`（橡皮擦范围同理）。
- **撤销重做**：`new ActionQueue().setActor(board)` 后调用 `undo()` / `redo()`，用 `canUndo` / `canRedo` 控制按钮可用状态。
