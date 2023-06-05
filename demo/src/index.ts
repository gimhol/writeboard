import {
  EventEnum,
  FactoryEnum, FactoryMgr,
  ILayerInits,
  Player, Recorder,
  Shape,
  ShapeEnum, ShapePen,
  ToolEnum,
  ToolType,
  WhiteBoard
} from "../../dist";
import { ColorView, LayersView, ToolsView } from "./layers_view";
import { ColorPalette } from "./colorPalette/ColorPalette"
import demo_helloworld from "./demo_helloworld"
import demo_rect_n_oval from "./demo_rect_n_oval"
import { UI } from "./ui/ele"
import { Menu } from '../../dist/features/Menu'
import { SubwinWorkspace } from "./G/SubwinWorkspace";
import { MergedSubwin } from "./G/MergedSubwin";

type State = {
  count: number
  width?: number
  height?: number
}
let whiteBoard: WhiteBoard


const mergedSubwin = new MergedSubwin();




const layersView = new LayersView;
layersView.addLayer({ name: 'layer_0' });
layersView.addLayer({ name: 'layer_1' });
layersView.addLayer({ name: 'layer_2' });
layersView.addLayer({ name: 'layer_3' });
layersView.addLayer({ name: 'layer_4' });
layersView.addLayer({ name: 'layer_5' });
layersView.addLayer({ name: 'layer_6' });
layersView.addLayer({ name: 'layer_7' });
layersView.addLayer({ name: 'layer_8' });
layersView.styleHolder().applyStyle('normal', (v) => ({ ...v, left: '150px', top: '150px' }))


const toolsView = new ToolsView;
toolsView.styleHolder().applyStyle('normal', (v) => ({ ...v, left: '150px', top: '5px' }))
toolsView.onToolClick = (btn) => whiteBoard.setToolType(btn.toolType)

const colorView = new ColorView;
colorView.styleHolder().applyStyle('normal', (v) => ({ ...v, left: '150px', top: '400px' }))

mergedSubwin.addSubWin(layersView)
mergedSubwin.addSubWin(toolsView)
mergedSubwin.addSubWin(colorView)

new SubwinWorkspace({
  zIndex: 1000,
  wins: [
    toolsView,
    layersView,
    colorView,
    mergedSubwin,
  ]
})

const factory = FactoryMgr.createFactory(FactoryEnum.Default)
let _recorder: Recorder | undefined
let _player: Player | undefined
let initState: State = {
  count: 1,
  width: 2048,
  height: 2048,
};

(window as any).ui = new UI<State, keyof State, 'hello'>(
  document.body,
  () => initState,
  (ui) => {
    ui.ele('div', {
      className: 'root'
    }, () => {
      ui.ele('div', {
        className: 'tool_bar'
      }, () => {
        ui.ele('br')
        ui.ele('button', { className: 'tool_button', innerText: 'select all', on: { click: () => whiteBoard.selectAll() } })
        ui.ele('button', { className: 'tool_button', innerText: 'remove selected', on: { click: () => whiteBoard.removeSelected() } })
        ui.ele('button', { className: 'tool_button', innerText: 'remove all', on: { click: () => whiteBoard.removeAll() } })
        ui.ele('br')
        ui.ele('button', {
          className: 'tool_button',
          innerText: '随机加1000个矩形',
          on: {
            click: (e, ele, ui) => {
              const items: Shape[] = []
              for (let i = 0; i < 1000; ++i) {
                const item = whiteBoard.factory.newShape(ShapeEnum.Rect)
                item.data.layer = whiteBoard.currentLayer().info.name;
                item.geo(
                  Math.floor(Math.random() * ui.state.width!),
                  Math.floor(Math.random() * ui.state.height!), 50, 50)
                const r = Math.floor(Math.random() * 255)
                const g = Math.floor(Math.random() * 255)
                const b = Math.floor(Math.random() * 255)
                item.data.fillStyle = `rgb(${r},${g},${b})`
                items.push(item)
              }
              whiteBoard.add(...items)
            }
          },
          listens: [
            [['count', 'height', 'width']]
          ]
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: '随机加1000个圆',
          on: {
            click: () => {
              const items: Shape[] = []
              for (let i = 0; i < 1000; ++i) {
                const item = whiteBoard.factory.newShape(ShapeEnum.Oval)
                item.data.layer = whiteBoard.currentLayer().info.name;
                item.geo(
                  Math.floor(Math.random() * ui.state.width!),
                  Math.floor(Math.random() * ui.state.height!), 50, 50)
                const r = Math.floor(Math.random() * 255)
                const g = Math.floor(Math.random() * 255)
                const b = Math.floor(Math.random() * 255)
                item.data.fillStyle = `rgb(${r},${g},${b})`
                items.push(item)
              }
              whiteBoard.add(...items)
            }
          }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: '随机画1000笔',
          on: {
            click: () => {
              const items: Shape[] = []
              for (let i = 0; i < 1000; ++i) {
                const item = whiteBoard.factory.newShape(ShapeEnum.Pen) as ShapePen
                let x = Math.floor(Math.random() * ui.state.width!)
                let y = Math.floor(Math.random() * ui.state.height!)
                const lenth = Math.floor(Math.random() * 100)
                for (let j = 0; j < lenth; ++j) {
                  x += Math.floor(Math.random() * 5)
                  y += Math.floor(Math.random() * 5)
                  item.appendDot({ x, y, p: 0.5 })
                }
                const r = Math.floor(Math.random() * 255)
                const g = Math.floor(Math.random() * 255)
                const b = Math.floor(Math.random() * 255)
                item.data.strokeStyle = `rgb(${r},${g},${b})`
                items.push(item)
              }
              whiteBoard.add(...items)
            }
          }
        })
        ui.ele('br')
        ui.ele('button', {
          className: 'tool_button',
          innerText: 'JSON化',
          on: {
            click: () => {
              _json_textarea.value = whiteBoard.toJsonStr()
            }
          }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: '反JSON化',
          on: {
            click: () => {
              whiteBoard.fromJsonStr(_json_textarea.value)
            }
          }
        })
        const _json_textarea = ui.ele('textarea')
        const startRecord = () => {
          _recorder?.destory()
          _recorder = new Recorder()
          _recorder.start(whiteBoard)
        }
        const endRecord = () => {
          if (!_recorder_textarea || !_recorder)
            return
          _recorder_textarea.value = _recorder.toJsonStr()
          _recorder?.destory()
          _recorder = undefined
        }
        const replay = (str: string) => {
          _player?.stop()
          _player = new Player()
          _player.start(whiteBoard, JSON.parse(str))
        }
        ui.ele('br')
        ui.ele('button', {
          className: 'tool_button',
          innerText: '开始录制', on: { click: startRecord }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: '停止录制', on: { click: endRecord }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: '回放', on: {
            click: () => {
              endRecord()
              replay(_recorder_textarea.value)
            }
          }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: `replay: write "hello world"`, on: {
            click: () => {
              endRecord()
              replay(demo_helloworld)
            }
          }
        })
        ui.ele('button', {
          className: 'tool_button',
          innerText: `replay: rect & oval`, on: {
            click: () => {
              endRecord()
              replay(demo_rect_n_oval)
            }
          }
        })
        const _recorder_textarea = ui.ele('textarea')

        // ui.current()?.append(toolsView.inner)
        // ui.current()?.append(layersView.inner)
        // ui.current()?.append(colorView.inner)
        ui.current()?.append(mergedSubwin.inner)


        ui.ele('canvas', {}, canvas => {
          canvas.width = 180
          canvas.height = 100
          canvas.style.minWidth = canvas.width + 'px'
          canvas.style.minHeight = canvas.height + 'px'
          canvas.style.maxWidth = canvas.width + 'px'
          canvas.style.maxHeight = canvas.height + 'px'
          const a = new ColorPalette(canvas)
          a.onChanged = (v) => {
            const shape = FactoryMgr.toolInfo(whiteBoard.toolType)?.shape
            if (!shape) return
            const template = whiteBoard.factory.shapeTemplate(shape)
            template.strokeStyle = '' + v
          }
        })
      })
      ui.ele('div', {
        alias: 'hello',
        className: 'blackboard',
        style: {
          position: 'relative'
        }
      }, () => {
        const layers = layersView.layers().map<ILayerInits>((layer, idx) => {
          const onscreen = ui.ele('canvas', {
            style: {
              position: idx === 0 ? 'relative' : 'absolute',
              touchAction: 'none',
              left: '0px',
              right: '0px',
              top: '0px',
              bottom: '0px'
            },
            oncontextmenu: (e) => {
              const ele = (e.target as HTMLElement);
              const { left, top } = ele.getBoundingClientRect()
              menu.move(e.x, e.y);
              menu.show();
            }
          })
          return { info: layer.state, onscreen }
        })
        whiteBoard = factory.newWhiteBoard({ layers, ...ui.state })
        whiteBoard.on(EventEnum.ToolChanged, () => {
          const { count } = ui.state;
          ui.setState({ count: count + 1 })
        })

      })
    })
  })

const menu = new Menu({
  items: [{
    key: 'shit',
    label: 'world'
  }, {
    key: 'shit0',
    label: 'world'
  }, {
    key: 'shit2',
    divider: true
  }, {
    key: 'shit1',
    label: 'world'
  }]
});
document.body.appendChild(menu.element());
