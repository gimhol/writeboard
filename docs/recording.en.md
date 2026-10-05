# Recording & playback

[简体中文](./recording.md) | English

Back to [documentation index](./README.en.md)

writeboard ships an **event-stream** recording mechanism: `Recorder` captures the **built-in events** happening on a board, and `Player` replays them along a timeline. Use it for tutorials, handwriting animation or session playback — no need to build your own timeline.

| Step | Class | Input / output |
|---|---|---|
| Record | `Recorder` | Subscribes to board events, produces `IScreenplay = { startTime, endTime, snapshot, events[] }` |
| Export | `Recorder.getJson()` | JSON text you can store locally or send to a server |
| Playback | `Player` | Consumes an `IScreenplay`: restores the starting snapshot, then replays events by timestamp |
| Undo/redo | `ActionQueue` | Independent of playback — it works on shape semantics, not on a timeline |

## 1. Recording

```ts
import { Recorder } from "@fimagine/writeboard"

const recorder = new Recorder().setActor(board)
recorder.start()                                // start recording
// …user interacts…
recorder.stop()                                 // stop (fills in endTime)

const screenplay = recorder.getScreenplay()!    // screenplay object
const json = recorder.getJson()!                // JSON text
```

| API | Description |
|---|---|
| `setActor(board)` / `getActor()` | Bind the board |
| `start()` | Starts recording: subscribes to **every built-in event in `EventEnum`**; **resets the previous screenplay**; warns and returns when no actor is set |
| `stop()` | Stops recording: writes `endTime`, unsubscribes everything (`running` becomes `false`) |
| `running` | Whether recording is active |
| `getScreenplay()` / `getJson()` | Screenplay object / JSON text; returns `null` before the first recording |
| `destroy()` (`destory()` is a spelling-compatible alias) | Release |

### Screenplay format

```ts
interface IScreenplay {
  startTime: number      // absolute performance.now() value
  endTime: number        // same clock, written by stop()
  snapshot?: ISnapshot   // board snapshot (layers + shapes) at the moment recording started
  events: IBaseDetail[]  // every event carries timestamp: ms relative to startTime
}
```

- Playback calls `fromSnapshot(snapshot)` first, so **the target board content is replaced entirely** — don't replay into the board you are currently drawing on.
- The `tool` field is stored as a **type string** (not a tool instance), so a screenplay is safe to `JSON.stringify`.
- Only built-in events are recorded. Operations that emit only custom events are not captured (see [custom tool](./custom-tool.en.md) §4).

### Which events repaint the board

| Event | Effect during playback |
|---|---|
| `SHAPES_ADDED` / `SHAPES_REMOVED` | Add / remove shapes |
| `SHAPES_CHANGING` / `SHAPES_CHANGED` | Merge shape data (pen coordinate deltas accumulate through this) |
| `SHAPES_GEO_CHANGING` / `SHAPES_GEO_CHANGED` | Merge geometry (x / y / w / h / r) |
| `WORLD_RECT_CHANGED` / `VIEWPORT_CHANGED` | Restore scroll position and viewport |
| `TOOL_*`, `TOOL_CHANGED`, `SHAPES_SELECTED` / `SHAPES_DESELECTED`, `LAYER_ADDED` / `LAYER_REMOVED`, `SHAPES_DONE` | Not replayed by the current `Player`, but they are the source for **other playback presentations — don't strip them by default** (see below) |

### Keep the extra events: playback is more than repainting shapes

Besides the picture itself, the recorded stream supports richer playback presentations, so `Recorder` records **everything** by default and you should keep it that way:

| Event | Current `Player` | Playback presentation it enables |
|---|---|---|
| `TOOL_DOWN` / `TOOL_MOVE` / `TOOL_DRAW` / `TOOL_UP` | ignored | A replay cursor / pen tip that follows the stroke (plus hover path), pen pressure `p`, active tool `tool`; coordinates are in **world space**, ready to be mapped onto the canvas |
| `TOOL_CHANGED` | ignored | Keep the toolbar's selected tool in sync while replaying |
| `SHAPES_DONE` | ignored | Stroke indexing (the n-th stroke), per-stroke redraw / looping a single stroke, final geometry of that stroke |
| `prev` inside paired events | `curr` only | Exact frame-by-frame rewind (no snapshot rebuild needed), difference highlighting |
| `SHAPES_SELECTED` / `SHAPES_DESELECTED` | ignored | Reproduce selection boxes / highlight animations |
| `LAYER_ADDED` / `LAYER_REMOVED` | ignored | Layer-aware playback (reveal layer by layer) |

Driving a replay cursor from `TOOL_*` (about 50 events/s at 60Hz input; coordinates are already world space — this is the inverse of [Board.map2world](../writeboard/board/Board.ts)):

```ts
/** TOOL_* events carry world coordinates */
type IDotEvent = { timestamp: number, x: number, y: number, p?: number }
const trail = screenplay.events
  .filter(e => e.type.startsWith('TOOL_'))                       // TOOL_MOVE is the hover path while the button is up
  .filter((e): e is typeof e & IDotEvent => Number.isFinite((e as Partial<IDotEvent>).x))
const cursor = document.getElementById('cursor')!
let i = 0

new Player().play(board, screenplay, {
  onProgress: (p) => {
    while (i < trail.length && trail[i].timestamp <= p.time) {
      const { x, y } = trail[i++]
      // world -> screen: add the canvas scroll offset (valid for scale 1 with the canvas at the viewport origin)
      cursor.style.transform = `translate(${x + board.world.x}px, ${y + board.world.y}px)`
    }
    if (p.state === 'ended') cursor.style.opacity = '0'
  },
})
```

### Making screenplays smaller (lossy, opt-in)

> Stripping events permanently removes the capabilities listed above. Only do it for **archive copies that merely need the picture replayed** — keep the original recording in full.

When you really need smaller archives, strip in this order (the further down, the more you lose):

```ts
const slim = {
  ...screenplay,
  events: screenplay.events.filter(e => !e.type.startsWith('TOOL_') && e.type !== 'SHAPES_DONE'),
}
```

Measured: a 32-point pen stroke is ~7.1KB, of which `TOOL_DRAW` × 30 alone is 4.5KB (64%); dropping `TOOL_*` leaves ~2.2KB and dropping `SHAPES_DONE` too leaves ~1.1KB. The bundled example screenplays: 12s "hello world" = 142 events / 102KB, 24s "rect & oval" = 204 events / 40KB.

### Size & capacity planning

Freehand writing is dominated by one thing: the board re-sends the whole stroke roughly every 33ms. `SHAPES_CHANGING` carries the pair `[curr, prev]` — `curr` holds only the newly landed points, while `prev` holds **every point of the stroke so far** — so a stroke gets heavier as it grows.

Measured (real browser, 1024×1024 board, pen tool, 60Hz pointer input, 1.5s strokes + 0.2s gaps, 21s recorded then extrapolated to one hour):

| Scenario | Points/s | 21s recording | Extrapolated 1 hour |
|---|---|---|---|
| 60Hz input, raw float coordinates | 50 | 833KB | ≈ 143MB |
| 60Hz input, coordinates quantized to 0.25px (closer to real hardware) | 50 | 564KB | ≈ 96MB |
| 60Hz input, 0.6s strokes (quick small strokes) | 44 | 557KB | ≈ 95MB |
| 120Hz input (high-refresh pen) | 74 | 1.14MB | ≈ 194MB |

**Order of magnitude: one hour of handwriting ≈ 100MB**; coordinate precision and input rate stretch that to 95 ~ 145MB, and high-refresh input to about 190MB. Of that, only ≈ 2.5MB (2.6%) is the final picture — everything else is process data.

Slimming the same 60Hz / 0.25px recording step by step (every step verified to replay the same **picture** — note that the dropped `TOOL_*` / `SHAPES_DONE` / `prev` are exactly the data behind the replay cursor / per-stroke redraw / frame-exact rewind, see the previous section):

| Variant | 21s | 1 hour |
|---|---|---|
| As recorded | 564KB | 96MB |
| `prev` dropped from each pair (coordinate deltas only) | 314KB | 53MB |
| Also drop `TOOL_*` / `SHAPES_DONE` | 155KB | 26MB |
| Previous variant + gzip | 15KB | 2.6MB |

`prev` exists for the library's own undo / redo (`ActionQueue` builds the inverse operation from it). Playback never needs it: `Player.seek()` backwards rebuilds from the snapshot and replays forward, and every event is applied from `curr` only. Drop it on export:

```ts
/** Collapse each [curr, prev] pair to [curr] while serializing */
const json = JSON.stringify(screenplay, (key, value) =>
  key === 'shapeDatas' && Array.isArray(value)
    ? value.map((d: unknown) => (Array.isArray(d) && d.length === 2 ? [d[0]] : d))
    : value
)
```

Capacity: localStorage's 5MB limit holds only ≈ 3 minutes as recorded, but ≈ 2 hours slimmed + gzipped. For long sessions store chunks in IndexedDB or let the server persist them.

The same transform applies to the bundled examples: `demo_helloworld.json` 102KB → 46KB (131 pairs) and `demo_rect_n_oval.json` 40KB → 30KB, both replaying to a final picture identical to the originals, shape by shape.

## 2. Playback

```ts
import { Player } from "@fimagine/writeboard"

const player = new Player()
player.play(board, screenplay, {
  rate: 2,                                    // speed: >1 faster, <1 slower, negative = rewind
  onProgress: (p) => bar.style.width = `${p.progress * 100}%`,
  onEnd: () => console.log('playback finished'),
})
```

| API | Description |
|---|---|
| `play(board, screenplay, options?)` | Play from the start; calls `stop()` internally, so repeated calls never stack timelines |
| `begin(board, screenplay)` | Restore the snapshot only, without starting the timeline (pair with `update_once()`) |
| `pause()` / `resume()` / `stop()` | Pause / resume / stop (`stop()` does not fire `onEnd`) |
| `seek(ms)` | Jump to a moment: forward is incremental, backwards rebuilds from the snapshot then replays |
| `update_once(ms)` | Apply every event with `timestamp <= ms` (manual driving, fast-forward) |
| `backward()` / `forward()` | Rewind / go forward (negates / restores `rate`) |
| `tick(ts)` | Advance one frame (normally driven by `requestAnimationFrame`) |
| `rate` | Playback speed, readable and writable, default 1 |
| `time` / `duration` / `progress` | Current playback time / screenplay length / progress (0 ~ 1) |
| `state` | `'idle'` / `'playing'` / `'paused'` / `'ended'` / `'stopped'` |
| `playing` / `paused` | Convenience state checks |
| `eventIndex` / `eventCount` | Applied events / total events |
| `getProgress()` | Everything above in one `IPlayerProgress` object |

`options` is `{ rate?, onProgress?(p: IPlayerProgress), onEnd?(p) }`; `onEnd` fires once when playback reaches the end naturally (or rewinds to the start).

### Progress bar + play / pause buttons

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

The demo's bottom toolbar works exactly like this: `⏺️` record/stop, `▶️` replay (2×), `⏸️` pause/resume, with the progress bar right below the buttons.

### Saving & loading

```ts
// save
localStorage.setItem('screenplay', recorder.getJson()!)

// load
player.play(board, JSON.parse(localStorage.getItem('screenplay')!))
```

For larger screenplays prefer a static file loaded on demand (keeps it out of your JS bundle):

```ts
const screenplay = await (await fetch('./assets/screenplays/demo_helloworld.json')).json()
player.play(board, screenplay, { rate: 2 })
```

## 3. Migrating legacy screenplays

0.1.x used a different format; feeding it to the current `Player` results in "it runs but replays nothing":

| Legacy | Current |
|---|---|
| `{ startTime, snapshot, events[] }` (no `endTime`) | `endTime` is expected; when missing, duration falls back to the last event timestamp |
| `event = { timeStamp, type, detail }` | `event = { type, timestamp, ...detail }` |
| `timeStamp` absolute within the recording session | `timestamp` relative to the screenplay start |
| `SHAPES_RESIZED` | `SHAPES_GEO_CHANGING` |

Migration helper (this project used it to convert the two bundled example screenplays into `demo/assets/screenplays/*.json`):

```ts
import type { IScreenplay } from "@fimagine/writeboard"

const RENAME: Record<string, string> = { SHAPES_RESIZED: 'SHAPES_GEO_CHANGING' }

/** Convert a 0.1.x screenplay to the current format; returns it unchanged when already current */
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

> Only the envelope changes — shape payloads stay as they are: `PenData.read()/merge()` accept both the legacy keys `coords`/`dotsType` and the compact `u`/`v`, and `ShapeData` accepts `style`/`status`.

## 4. Limitations

- **Built-in events only**: custom events never enter a screenplay unless your operation reuses built-in event types (see [custom tool](./custom-tool.en.md) §4.3).
- **It replays the picture, not the pointer**: `TOOL_*` events are recorded but not replayed, so there is no cursor animation.
- **Selection and layer changes are not replayed**: layers inside the snapshot are restored, but layers added/removed while recording and selection boxes are not.
- **Playback replaces board content**: when a screenplay has a `snapshot`, `begin()` / `play()` call `fromSnapshot()` first.
- **Don't replay into a destroyed board**: after `Board.destroy()` playback throws while touching layers.
- **The clock is `performance.now()`**: screenplays port across pages thanks to relative timestamps, but recording while the tab is in the background causes a time jump (playback jumps to the current position).

## 5. Try it in the demo

```shell
npm install
npm run demo      # builds the demo into output/ (watch mode)
```

Open `output/index.html`:

- bottom toolbar: `⏺️` start/stop recording → draw something → `▶️` replay (2×) with the progress bar below the buttons; `⏸️` pauses/resumes;
- the console also exposes `window.record.start()/stop()` and `window.player.play()/stop()`;
- [demo/RecorderView.ts](../demo/RecorderView.ts) (used by `demo/index_2.ts`) demonstrates "record → textarea → replay" plus loading the bundled "hello world" / "rect & oval" screenplays from `assets/screenplays/`;
- those examples were recorded on a 1024 × 1024 board, matching the canvas size of `demo/index_2.ts`.
