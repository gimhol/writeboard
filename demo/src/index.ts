import {
  FactoryEnum, FactoryMgr,
  ILayerInits,
  Player, Recorder,
  Shape,
  ShapeEnum, ShapePen,
  WhiteBoard
} from "../../dist";
import { Menu } from '../../dist/features/Menu';
import ColorView from "./ColorView";
import { Button } from "./G/BaseView/Button";
import { Canvas } from "./G/BaseView/Canvas";
import { View } from "./G/BaseView/View";
import { MergedSubwin } from "./G/CompoundView/MergedSubwin";
import { Subwin } from "./G/CompoundView/Subwin";
import { SubwinWorkspace } from "./G/Helper/SubwinWorkspace";
import { RGBA } from "./colorPalette/Color";
import demo_helloworld from "./demo_helloworld";
import demo_rect_n_oval from "./demo_rect_n_oval";
import { LayersView, ToolsView } from "./layers_view";
import { UI } from "./ui/ele";

let board: WhiteBoard
const mergedSubwin2 = new MergedSubwin();
const mergedSubwin = new MergedSubwin();

const layersView = new LayersView;
layersView.addLayer({ name: 'Default' });
layersView.styles().apply('normal', (v) => ({ ...v, left: '150px', top: '150px' }))

const toolsView = new ToolsView;
toolsView.styles().apply('normal', (v) => ({ ...v, left: '150px', top: 5 }))
toolsView.onToolClick = (btn) => board.setToolType(btn.toolType)

const colorView = new ColorView;
colorView.styles().apply('normal', (v) => ({ ...v, left: '150px', top: '400px' }))

mergedSubwin.addSubWin(layersView)
mergedSubwin.addSubWin(toolsView)
mergedSubwin.addSubWin(colorView)

colorView.inner.addEventListener(ColorView.EventTypes.LineColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  FactoryMgr.listTools().forEach(toolType => {
    const shape = FactoryMgr.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.strokeStyle = '' + rgba.toHex();
  })
})
colorView.inner.addEventListener(ColorView.EventTypes.FillColorChange, (e) => {
  const rgba = (e as CustomEvent).detail as RGBA;
  FactoryMgr.listTools().forEach(toolType => {
    const shape = FactoryMgr.toolInfo(toolType)?.shape
    if (!shape) return;
    const template = board.factory.shapeTemplate(shape);
    template.fillStyle = '' + rgba.toHex();
  })
})

const toyView = new Subwin();
toyView.header.title = 'others';

const mainView = new View('body');
mainView.addChild(toyView);
mainView.addChild(mergedSubwin2);
mainView.addChild(mergedSubwin);

const workspace = new SubwinWorkspace({
  view: mainView,
  rect() {
    return {
      x: 0, y: 0,
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
  },
  zIndex: 1000,
  wins: [
    toolsView,
    layersView,
    colorView,
    mergedSubwin,
    mergedSubwin2,
    toyView
  ]
});
window.addEventListener('resize', () => workspace.clampAllSubwin())

toyView.content = new View('div');
toyView.content.styles().apply('', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden'
})
toyView.content.addChild(new Button({
  content: 'select all'
}).onClick(() => board.selectAll()))

toyView.content.addChild(new Button({
  content: 'remove selected'
}).onClick(() => board.removeSelected()))

toyView.content.addChild(new Button({
  content: 'remove all'
}).onClick(() => board.removeAll()))

toyView.content.addChild(new Button({
  content: 'random add 1000 rect'
}).onClick(() => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Rect)
    item.data.layer = board.currentLayer().info.name;
    item.geo(
      Math.floor(Math.random() * board.width),
      Math.floor(Math.random() * board.height!), 50, 50)
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    item.data.fillStyle = `rgb(${r},${g},${b})`
    items.push(item)
  }
  board.add(...items)
}))

toyView.content.addChild(new Button({
  content: 'random add 1000 oval'
}).onClick(() => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Oval)
    item.data.layer = board.currentLayer().info.name;
    item.geo(
      Math.floor(Math.random() * board.width!),
      Math.floor(Math.random() * board.height!), 50, 50)
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    item.data.fillStyle = `rgb(${r},${g},${b})`
    items.push(item)
  }
  board.add(...items)
}))

toyView.content.addChild(new Button({
  content: 'random draw 1000 pen'
}).onClick(() => {
  const items: Shape[] = []
  for (let i = 0; i < 1000; ++i) {
    const item = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    item.data.layer = board.currentLayer().info.name;
    let x = Math.floor(Math.random() * board.width!)
    let y = Math.floor(Math.random() * board.height!)
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
  board.add(...items)
}))

const factory = FactoryMgr.createFactory(FactoryEnum.Default)
let _recorder: Recorder | undefined
let _player: Player | undefined


const jsonView = new Subwin();
jsonView.header.title = 'json';
jsonView.content = new View('div');
jsonView.content.styles().apply('', { flex: 1, display: 'flex', flexDirection: 'column' })
const _recorder_textarea = new View('textarea')
jsonView.content.addChild(new Button({ content: 'JSON化' }).onClick(() => {

}));
jsonView.content.addChild(new Button({ content: '反JSON化' }).onClick(() => {

}));
jsonView.content.addChild(_recorder_textarea);
mergedSubwin.addSubWin(jsonView);
workspace.addSubWin(jsonView);

{
  const startRecord = () => {
    _recorder?.destory();
    _recorder = new Recorder();
    _recorder.start(board);
  }
  const endRecord = () => {
    if (!_recorder_textarea || !_recorder)
      return
    _recorder_textarea.inner.value = _recorder.toJsonStr()
    _recorder?.destory()
    _recorder = undefined
  }
  const replay = (str: string) => {
    _player?.stop()
    _player = new Player()
    _player.start(board, JSON.parse(str))
  }
  const recorderView = new Subwin();
  recorderView.header.title = 'recorder';
  recorderView.content = new View('div');
  recorderView.content.styles().apply('', { flex: 1, display: 'flex', flexDirection: 'column' })
  const _json_textarea = new View('textarea')
  recorderView.content.addChild(new Button({ content: '开始录制' }).onClick(startRecord));
  recorderView.content.addChild(new Button({ content: '停止录制' }).onClick(endRecord));
  recorderView.content.addChild(new Button({ content: '回放' }).onClick(() => {
    endRecord()
    replay(_recorder_textarea.inner.value)
  }));

  recorderView.content.addChild(new Button({ content: 'replay: write "hello world"' }).onClick(() => {
    endRecord()
    replay(demo_helloworld)
  }));
  recorderView.content.addChild(new Button({ content: 'replay: rect & oval' }).onClick(() => {
    endRecord()
    replay(demo_rect_n_oval)
  }));
  recorderView.content.addChild(_json_textarea);
  mergedSubwin.addSubWin(recorderView);
  workspace.addSubWin(recorderView);
}

(window as any).ui = new UI<{}, string, 'hello'>(
  document.body,
  () => ({}),
  (ui) => {
    ui.ele('div', {
      className: 'root'
    }, () => {
      ui.ele('br')
      ui.ele('div', {
        alias: 'hello',
        className: 'blackboard',
        style: {
          position: 'relative'
        }
      }, () => {
        const layers = layersView.layers().map<ILayerInits>((layer, idx) => {
          const canvas = new Canvas();
          canvas.styles().apply('', {
            position: idx === 0 ? 'relative' : 'absolute',
            touchAction: 'none',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          })
          canvas.inner.addEventListener('contextmenu', (e) => {
            menu.move(e.x, e.y);
            menu.show();
          })
          ui.current()?.append(canvas.inner)
          return { info: layer.state, onscreen: canvas.inner }
        })
        board = factory.newWhiteBoard({ layers, width: 1024, height: 1024 })
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
