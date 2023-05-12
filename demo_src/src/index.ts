import {
  EventEnum,
  FactoryEnum, FactoryMgr,
  ILayerInits,
  Player, Recorder,
  Shape,
  ShapeEnum, ShapePen,
  ToolEnum,
  WhiteBoard
} from "../../dist"
import { ToolType } from "../../dist/tools/ToolEnum"
import { ColorPalette } from "./colorPalette/ColorPalette"
import demo_helloworld from "./demo_helloworld"
import demo_rect_n_oval from "./demo_rect_n_oval"
import { UI } from "./ui/ele"

type State = {
  count: number
  width?: number
  height?: number
}
let whiteBoard: WhiteBoard
const factory = FactoryMgr.createFactory(FactoryEnum.Default)
let _recorder: Recorder | undefined
let _player: Player | undefined
let initState: State = {
  count: 1,
  width: 2048,
  height: 2048,
};

(window as any).ui = new UI<State>(document.body, initState, (ui) => {
  const toolBtn = (toolType: ToolType) => {
    const { name = toolType } = FactoryMgr.toolInfo(toolType) || {}
    ui.dynamic('button', {
      className: 'tool_button',
      innerText: name,
      disabled: whiteBoard?.toolType === toolType,
      onclick: () => whiteBoard?.setToolType(toolType)
    })
  }
  ui.dynamic('div', {
    className: 'root'
  }, div => {
    ui.dynamic('div', {
      className: 'tool_bar'
    }, div => {
      toolBtn(ToolEnum.Selector)
      toolBtn(ToolEnum.Pen)
      toolBtn(ToolEnum.Rect)
      toolBtn(ToolEnum.Oval)
      toolBtn(ToolEnum.Text)
      ui.static('br')
      ui.dynamic('button', { className: 'tool_button', innerText: 'select all', onclick: () => whiteBoard.selectAll() })
      ui.dynamic('button', { className: 'tool_button', innerText: 'remove selected', onclick: () => whiteBoard.removeSelected() })
      ui.dynamic('button', { className: 'tool_button', innerText: 'remove all', onclick: () => whiteBoard.removeAll() })
      ui.dynamic('br')
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '随机加1000个矩形', onclick: () => {
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
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '随机加1000个圆',
        onclick: () => {
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
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '随机画1000笔', onclick: () => {
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
      })
      ui.dynamic('br')
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: 'JSON化', onclick: () => {
          _json_textarea.value = whiteBoard.toJsonStr()
        }
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '反JSON化', onclick: () => {
          whiteBoard.fromJsonStr(_json_textarea.value)
        }
      })
      const _json_textarea = ui.dynamic('textarea')
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
        whiteBoard && _player.start(whiteBoard, JSON.parse(str))
      }
      ui.dynamic('br')
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '开始录制', onclick: startRecord
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '停止录制', onclick: endRecord
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: '回放', onclick: () => {
          endRecord()
          replay(_recorder_textarea.value)
        }
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: `replay: write "hello world"`, onclick: () => {
          endRecord()
          replay(demo_helloworld)
        }
      })
      ui.dynamic('button', {
        className: 'tool_button',
        innerText: `replay: rect & oval`, onclick: () => {
          endRecord()
          replay(demo_rect_n_oval)
        }
      })
      ui.static('button', {
        className: 'tool_button',
        innerText: 'layer_0',
        onclick: () => whiteBoard.setCurrentLayer(0)
      })
      ui.static('button', {
        className: 'tool_button',
        innerText: 'layer_1',
        onclick: () => whiteBoard.setCurrentLayer(1)
      })
      ui.static('button', {
        className: 'tool_button',
        innerText: 'layer_2',
        onclick: () => whiteBoard.setCurrentLayer(2)
      });
      ui.static('input', {
        type: 'checkbox',
        className: 'tool_button',
        innerText: 'layer_0',
        onchange: (e) => { whiteBoard.layer(0).onscreen.style.opacity = (e.target as any).checked ? '0' : '1' }
      })
      ui.static('input', {
        type: 'checkbox',
        className: 'tool_button',
        innerText: 'layer_1',
        onchange: (e) => { whiteBoard.layer(1).onscreen.style.opacity = (e.target as any).checked ? '0' : '1' }
      })
      ui.static('input', {
        type: 'checkbox',
        className: 'tool_button',
        innerText: 'layer_2',
        onchange: (e) => { whiteBoard.layer(2).onscreen.style.opacity = (e.target as any).checked ? '0' : '1' }
      })
      const _recorder_textarea = ui.dynamic('textarea')

      ui.static('canvas', canvas => {
        canvas.width = 180
        canvas.height = 100
        canvas.style.minWidth = canvas.width + 'px'
        canvas.style.minHeight = canvas.height + 'px'
        canvas.style.maxWidth = canvas.width + 'px'
        canvas.style.maxHeight = canvas.height + 'px'
        const a = new ColorPalette(canvas)
        a._onChanged = (v) => {
          const shape = FactoryMgr.toolInfo(whiteBoard.toolType)?.shape
          if (!shape) return
          const template = whiteBoard.factory.shapeTemplate(shape)
          template.strokeStyle = '' + v
        }
      })
    })
    ui.static('div', {
      className: 'blackboard',
      style: {
        'position': 'relative'
      }
    }, (div) => {
      const layers = ['1', '2', ''].map<ILayerInits>((name, idx) => {
        const onscreen = ui.static('canvas', {
          style: {
            position: idx === 0 ? 'relative' : 'absolute',
            touchAction: 'none',
            left: '0px',
            right: '0px',
            top: '0px',
            bottom: '0px'
          }
        })
        return { info: { name }, onscreen }
      })
      whiteBoard = factory.newWhiteBoard({ layers, ...ui.state })
      whiteBoard.on(EventEnum.ToolChanged, () => ui.refresh())

    })
  })
})
