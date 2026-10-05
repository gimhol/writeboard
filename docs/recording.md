# 录制与回放

简体中文 | [English](./recording.en.md)

返回 [文档目录](./README.md)

writeboard 内置了一套「事件流」录制回放：`Recorder` 记录板子上发生的**内置事件**，`Player` 按时间轴把它们重演回去。教学演示、笔迹动画、操作回放都可以直接用它，不必自己实现时间轴。

| 环节 | 类 | 输入 / 产出 |
|---|---|---|
| 录制 | `Recorder` | 订阅板子事件，产出 `IScreenplay = { startTime, endTime, snapshot, events[] }` |
| 导出 | `Recorder.getJson()` | JSON 文本，可存本地、发服务端 |
| 回放 | `Player` | 消费 `IScreenplay`，先把板子还原成起点快照，再按时间重演 |
| 撤销重做 | `ActionQueue` | 与回放相互独立：它只看图形语义，不看时间轴 |

## 1. 录制

```ts
import { Recorder } from "@fimagine/writeboard"

const recorder = new Recorder().setActor(board)
recorder.start()                                // 开始录制
// …用户操作…
recorder.stop()                                 // 结束录制（补上 endTime）

const screenplay = recorder.getScreenplay()!    // 剧本对象
const json = recorder.getJson()!                // JSON 文本
```

| API | 说明 |
|---|---|
| `setActor(board)` / `getActor()` | 绑定板子 |
| `start()` | 开始录制：订阅 `EventEnum` 的**全部内置事件**；**会重置上一次的剧本**；未设置 actor 时打印警告并返回 |
| `stop()` | 结束录制：写入 `endTime`、解除全部订阅（`running` 变回 `false`） |
| `running` | 是否正在录制 |
| `getScreenplay()` / `getJson()` | 取剧本对象 / JSON 文本；还没录制过时返回 `null` |
| `destroy()`（`destory()` 是拼写兼容别名） | 释放 |

### 剧本格式

```ts
interface IScreenplay {
  startTime: number      // performance.now() 的绝对值
  endTime: number        // 同上，由 stop() 写入
  snapshot?: ISnapshot   // 录制开始那一刻的板子快照（图层 + 图形）
  events: IBaseDetail[]  // 每个事件带 timestamp：相对 startTime 的毫秒数
}
```

- 回放时会先 `fromSnapshot(snapshot)` 还原起点，**目标板子的内容会被整个替换**，别拿正在画的板子直接回放。
- 事件里的 `tool` 记录为**类型字符串**（不是工具实例），所以整份剧本可以安全 `JSON.stringify`。
- 只录内置事件。只广播自定义事件的操作不会被记录，详见 [自定义工具](./custom-tool.md) §4。

### 哪些事件影响回放画面

| 事件 | 回放时的作用 |
|---|---|
| `SHAPES_ADDED` / `SHAPES_REMOVED` | 增删图形 |
| `SHAPES_CHANGING` / `SHAPES_CHANGED` | 合并图形数据（画笔的坐标增量就靠它一点点累积） |
| `SHAPES_GEO_CHANGING` / `SHAPES_GEO_CHANGED` | 合并几何（x / y / w / h / r） |
| `WORLD_RECT_CHANGED` / `VIEWPORT_CHANGED` | 还原滚动位置与视口 |
| `TOOL_*`、`TOOL_CHANGED`、`SHAPES_SELECTED` / `SHAPES_DESELECTED`、`LAYER_ADDED` / `LAYER_REMOVED`、`SHAPES_DONE` | 会录进剧本，但**不影响回放画面** |

### 让剧本更小

上表最后一行的事件占了相当比重，导出前裁掉即可：

```ts
const slim = {
  ...screenplay,
  events: screenplay.events.filter(e => !e.type.startsWith('TOOL_') && e.type !== 'SHAPES_DONE'),
}
```

实测数据：一条 32 点的画笔笔画约 7.1KB，其中 `TOOL_DRAW` × 30 就占 4.5KB（64%）；裁掉 `TOOL_*` 后约 2.2KB，再裁掉 `SHAPES_DONE` 后约 1.1KB。仓库自带的示例剧本：12 秒的 "hello world" = 142 事件 / 102KB，24 秒的 "rect & oval" = 204 事件 / 40KB。

## 2. 回放

```ts
import { Player } from "@fimagine/writeboard"

const player = new Player()
player.play(board, screenplay, {
  rate: 2,                                    // 倍速：>1 快放、<1 慢放、负数倒放
  onProgress: (p) => bar.style.width = `${p.progress * 100}%`,
  onEnd: () => console.log('播放完毕'),
})
```

| API | 说明 |
|---|---|
| `play(board, screenplay, options?)` | 从头播放；内部先 `stop()`，重复调用不会叠加时间轴 |
| `begin(board, screenplay)` | 只还原快照、不启动时间轴（配 `update_once()` 手动驱动） |
| `pause()` / `resume()` / `stop()` | 暂停 / 继续 / 停止（`stop()` 不会触发 `onEnd`） |
| `seek(ms)` | 跳到某个时刻：往前是增量应用，往回会从快照重建后重放 |
| `update_once(ms)` | 应用所有 `timestamp <= ms` 的事件（手动驱动、快进） |
| `backward()` / `forward()` | 倒放 / 正放（等价于把 `rate` 取负 / 取正） |
| `tick(ts)` | 推进一帧（平时由 `requestAnimationFrame` 驱动） |
| `rate` | 倍速，可读可写，默认 1 |
| `time` / `duration` / `progress` | 当前回放时间 / 剧本时长 / 进度（0 ~ 1） |
| `state` | `'idle'` / `'playing'` / `'paused'` / `'ended'` / `'stopped'` |
| `playing` / `paused` | 状态快捷判断 |
| `eventIndex` / `eventCount` | 已应用事件数 / 事件总数 |
| `getProgress()` | 一次取回上面这些进度信息（`IPlayerProgress`） |

`options` 为 `{ rate?, onProgress?(p: IPlayerProgress), onEnd?(p) }`；`onEnd` 只在**自然播放到底**（或倒放到头）时触发一次。

### 进度条 + 播放 / 暂停按钮

```ts
const bar = document.getElementById('bar')!
const player = new Player()

playBtn.onclick = () => {
  player.play(board, screenplay, {
    rate: 2,
    onProgress: (p) => { bar.style.width = `${p.progress * 100}%` },
    onEnd: () => { bar.style.width = '100%' },
  })
}

pauseBtn.onclick = () => {
  if (player.playing) { player.pause(); pauseBtn.textContent = '继续'; return }
  if (player.paused) { player.resume(); pauseBtn.textContent = '暂停' }
}
```

demo 的底部工具栏就是这么实现的：`⏺️` 录制 / 停止、`▶️` 回放（2 倍速）、`⏸️` 暂停 / 继续，按钮下方是那条进度条。

### 保存与载入

```ts
// 保存
localStorage.setItem('screenplay', recorder.getJson()!)

// 载入
player.play(board, JSON.parse(localStorage.getItem('screenplay')!))
```

较大的剧本建议放成静态文件按需加载（不进 JS bundle）：

```ts
const screenplay = await (await fetch('./assets/screenplays/demo_helloworld.json')).json()
player.play(board, screenplay, { rate: 2 })
```

## 3. 迁移旧版剧本

0.1.x 的剧本格式和现在不同，直接喂给当前 `Player` 会出现「能跑但什么都不重演」：

| 旧格式 | 现格式 |
|---|---|
| `{ startTime, snapshot, events[] }`（没有 `endTime`） | 需要 `endTime`；缺失时时长会退化为按最后一个事件推断 |
| `event = { timeStamp, type, detail }` | `event = { type, timestamp, ...detail }` |
| `timeStamp` 是录制会话里的绝对毫秒 | `timestamp` 是相对起点的毫秒 |
| `SHAPES_RESIZED` | `SHAPES_GEO_CHANGING` |

迁移函数（本项目就是用它把两个旧示例剧本转成了 `demo/assets/screenplays/*.json`）：

```ts
import type { IScreenplay } from "@fimagine/writeboard"

const RENAME: Record<string, string> = { SHAPES_RESIZED: 'SHAPES_GEO_CHANGING' }

/** 把 0.1.x 的剧本转成当前格式；已经是新格式时原样返回 */
export function migrateScreenplay(raw: any): IScreenplay {
  const events: any[] = Array.isArray(raw.events) ? raw.events : []
  const legacy = events.some(e => e && ('detail' in e || 'timeStamp' in e))
  if (!legacy) return raw as IScreenplay

  const times = events.map(e => (typeof e?.timeStamp === 'number' ? e.timeStamp : 0))
  const min = Math.min(...times)
  const max = Math.max(...times)
  const startTime = raw.startTime || 0
  return {
    startTime,
    endTime: startTime + (max - min),
    snapshot: raw.snapshot,
    events: events.map(e => {
      const detail = e?.detail ?? {}
      return {
        ...detail,
        type: RENAME[e.type] ?? e.type,   // SHAPES_RESIZED → SHAPES_GEO_CHANGING
        timestamp: (typeof e.timeStamp === 'number' ? e.timeStamp : 0) - min,
        operator: detail.operator || 'legacy',
      }
    }),
  }
}
```

> 迁移只改「信封」，图形数据本身不用动：`PenData.read()/merge()` 同时认旧键 `coords`/`dotsType` 和新键 `u`/`v`，`ShapeData` 也认 `style`/`status`。

## 4. 能力边界

- **只录内置事件**：自定义事件不会进剧本，除非你的操作复用内置事件类型（见 [自定义工具](./custom-tool.md) §4.3）。
- **重演的是画面，不是鼠标**：`TOOL_*` 事件只记录不重放，所以看不到指针动画。
- **选择态 / 图层增删不重放**：快照里的图层会被还原，但录制过程中新增删除的图层、选中框不会重现。
- **回放会替换板子内容**：剧本带 `snapshot` 时，`begin()` / `play()` 会先 `fromSnapshot()`。
- **别对已销毁的板子回放**：`Board.destroy()` 之后继续回放会在改图层报错。
- **时间基准是 `performance.now()`**：跨页面载入的剧本用相对时间戳，不受影响；但录制时切到后台标签页会导致时间跳跃（回放会直接跳到当前时刻）。

## 5. 在 demo 里试

```shell
npm install
npm run demo      # 构建 demo 到 output/（watch 模式）
```

打开 `output/index.html`：

- 底部工具栏 `⏺️` 开始 / 停止录制 → 画点东西 → `▶️` 回放（2 倍速），按钮下方进度条会跟着走；`⏸️` 暂停 / 继续；
- 控制台里还有 `window.record.start()/stop()`、`window.player.play()/stop()` 可以直接调；
- [demo/RecorderView.ts](../demo/RecorderView.ts)（用于 `demo/index_2.ts` 的 recorder 面板）演示了「录制 → 文本框 → 回放」，以及从 `assets/screenplays/` 加载内置示例剧本 "hello world" / "rect & oval"；
- 示例剧本录于 1024 × 1024 的板子，对应 `demo/index_2.ts` 的画布尺寸。
