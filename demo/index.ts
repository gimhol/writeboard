import * as Gim from ".";
import {
  ActionQueue,
  EventEnum,
  FactoryEnum, Gaia,
  ObjectFit,
  Player,
  Recorder,
  ShapeEnum,
  ShapeImg,
  ShapeText,
  TextData,
  ToolEnum,
} from "../writeboard";
import img_logo from './assets/img/logo.png';
import img_header_0 from "./assets/img/calendar_phrases/main_pics/header_0.jpg";
import img_header_1 from "./assets/img/calendar_phrases/main_pics/header_1.jpg";
import img_header_2 from "./assets/img/calendar_phrases/main_pics/header_2.jpg";
import img_header_3 from "./assets/img/calendar_phrases/main_pics/header_3.jpg";
import "./styles/calendar_phrases/edit_panel.css";
import "./styles/calendar_phrases/index.css";
import { Button } from "./G/BaseView/Button";
import { SizeType } from "./G/BaseView/SizeType";
import { View } from "./G/BaseView/View";
import { Menu } from "./G/CompoundView/Menu";
import { ButtonGroup } from "./G/Helper/ButtonGroup";
import "./index.css";
import { Shiftable } from "./Shiftable";
import { ShortcutsKeeper } from "./Shortcuts";
console.log('img_logo', img_logo)
View.get(document.head).addChild(
  new View('title', '每日一句'),
  new View('link')
    .setAttribute('rel', 'icon')
    .setAttribute('sizes', '16x16')
    .setAttribute('href', img_logo)
);


Gaia.editToolInfo(ToolEnum.Cross, v => ({ ...v, name: '打叉' }));
Gaia.editToolInfo(ToolEnum.HalfTick, v => ({ ...v, name: '半对' }));
Gaia.editToolInfo(ToolEnum.Img, v => ({ ...v, name: '图片' }));
Gaia.editToolInfo(ToolEnum.Lines, v => ({ ...v, name: '直线' }));
Gaia.editToolInfo(ToolEnum.Oval, v => ({ ...v, name: '椭圆' }));
Gaia.editToolInfo(ToolEnum.Pen, v => ({ ...v, name: '笔' }));
Gaia.editToolInfo(ToolEnum.Polygon, v => ({ ...v, name: '多边形' }));
Gaia.editToolInfo(ToolEnum.Rect, v => ({ ...v, name: '矩形' }));
Gaia.editToolInfo(ToolEnum.Selector, v => ({ ...v, name: '选择器' }));
Gaia.editToolInfo(ToolEnum.Text, v => ({ ...v, name: '文本' }));
Gaia.editToolInfo(ToolEnum.Tick, v => ({ ...v, name: '打钩' }));

enum MenuKey {
  SelectAll = 'SelectAll',
  RemoveSelected = 'RemoveSelected',
  Deselect = 'Deselect',
  ClearUp = 'ClearUp',
  InsertImage = 'InsertImage',
  ExportResult = 'ExportResult',
}

function main() {
  const resultWidth = 600;
  const resultHeight = 600;
  const factory = Gaia.factory(FactoryEnum.Default)();

  const ffn = factory.fontFamilies().map(ff => ff + ' = ' + factory.fontName(ff))
  console.log('可用字体：', ffn)
  const mainView = View.ref<'body'>()
  const blackboard = View.ref<'div'>()

  View.get(document.body)
    .ref(mainView)
    .styles
    .addCls('g_cp_main_view')
    .view
    .addChild(
      View.get('div')
        .styles.addCls('g_cp_content_zone').view
        .addChild(
          View.get('div')
            .ref(blackboard)
            .styles
            .addCls('g_cp_blackboard')
            .apply('size', {
              width: resultWidth,
              height: resultHeight,
            })
            .view
        )
    );

  let m = false;
  let mx = 0;
  let my = 0;
  blackboard.current?.inner.addEventListener('pointerdown', (e) => {
    if (e.button !== 1) return;
    m = true;
    mx = board.world.x - e.x;
    my = board.world.y - e.y;

  })
  document.body.addEventListener('pointerup', (e) => {
    if (e.button !== 1) return;
    m = false;
  })
  document.body.addEventListener('pointercancel', (e) => {
    if (e.button !== 1) return;
    m = false;
  })
  document.body.addEventListener('pointermove', (e) => {
    if (!m) return;
    board.scroll_to(mx + e.x, my + e.y)
  })

  const menu = new Menu(mainView.current!).setup([{
    label: '工具',
    items: Gaia.listTools()
      .filter(v => v !== ToolEnum.Img && v !== ToolEnum.Polygon)
      .map(v => ({ key: v, label: Gaia.toolInfo(v)?.name ?? v }))
  }, {
    divider: true
  }, {
    key: MenuKey.InsertImage,
    label: '插入图片'
  }, {
    divider: true
  }, {
    key: MenuKey.ExportResult,
    label: '生成图片'
  }, {
    divider: true
  }, {
    key: MenuKey.SelectAll,
    label: '全选'
  }, {
    key: MenuKey.Deselect,
    label: '取消选择'
  }, {
    key: MenuKey.RemoveSelected,
    label: '删除选择'
  }, {
    divider: true
  }, {
    key: MenuKey.ClearUp,
    label: '删除全部',
    danger: true,
  }]);

  menu.addEventListener(Menu.EventType.ItemClick, (e) => {
    switch (e.detail.key) {
      case ToolEnum.Rect:
      case ToolEnum.Oval:
      case ToolEnum.Pen:
      case ToolEnum.Polygon:
      case ToolEnum.Text:
      case ToolEnum.Selector:
      case ToolEnum.Tick:
      case ToolEnum.Cross:
      case ToolEnum.HalfTick:
      case ToolEnum.Lines:
      case ToolEnum.Img:
        board.setToolType(e.detail.key);
        break;
      case MenuKey.SelectAll:
        board.selectAll(true);
        break;
      case MenuKey.Deselect:
        board.deselect(true);
        break;
      case MenuKey.RemoveSelected:
        board.removeSelected(true);
        break;
      case MenuKey.ClearUp:
        board.removeAll(true);
        break;
      case MenuKey.InsertImage: {
        const input = document.createElement('input');
        input.accept = '.png,.jpeg,.jpg'
        input.type = 'file';
        input.multiple = true;
        input.title = '选择图片';
        input.onchange = () => {
          const { files } = input;
          if (!files) { return }
          for (let i = 0; i < files.length; ++i) {
            const file = files.item(i);
            if (!file) { continue; }
            const img = new Image();
            img.src = URL.createObjectURL(file)
            img.onload = () => {
              const shape = board.factory.newShape(ShapeEnum.Img) as ShapeImg;
              shape.data.src = img.src;
              shape.data.w = img.naturalWidth;
              shape.data.h = img.naturalHeight;
              shape.data.layer = board.layer().id;
              shape.data.objectFit = ObjectFit.Cover;
              board.add(shape, true);
            }
          }
        }
        input.click();
        break;
      }
      case MenuKey.ExportResult: {
        download();
        break;
      }
    }
  });

  const resize = () => {
    const { width } = mainView.current!.inner.getBoundingClientRect();
    blackboard.current!.styles.apply('transform', {
      transform: `translate(-50%,-50%) scale(${Math.min(1, width / resultWidth)})`
    })
  }
  window.addEventListener('resize', resize)
  resize();

  const board = factory.newWhiteBoard({
    width: resultWidth,
    height: resultHeight,
    element: blackboard.current!.inner,
  });
  const aq = new ActionQueue().setActor(board);
  const rec = new Recorder().setActor(board);
  const sc = new Player()

  const updateEditPanel = () => {
    let needFill = false;
    let needStroke = false;
    let needText = false;
    let needImg = false;
    let lineWidth: number | undefined | null = null;
    let fontSize: number | undefined | null = null;

    board.selects.forEach(shape => {
      needFill = needFill || shape.data.needFill;
      needStroke = needStroke || shape.data.needStroke;
      needText = needText || shape.data.type === ShapeEnum.Text;
      needImg = needImg || shape.data.type === ShapeEnum.Img;
      if (shape.data.needStroke) {
        const temp = shape.data.lineWidth;
        if (lineWidth === null) {
          lineWidth = temp;
        } else if (lineWidth !== temp) {
          lineWidth = undefined;
        }
      }
      if (shape.data.type === ShapeEnum.Text) {
        const temp = (shape.data as TextData).font_size;
        if (fontSize === null) {
          fontSize = temp;
        } else if (fontSize !== temp) {
          fontSize = undefined;
        }
      }
    });

    btnFontSizeDown.disabled = !needText
    btnFontSizeUp.disabled = !needText
    btnLineWidthDown.disabled = !needStroke
    btnLineWidthUp.disabled = !needStroke
  }

  board.addEventListener(EventEnum.ShapesSelected, e => updateEditPanel());
  board.addEventListener(EventEnum.ShapesDeselected, e => updateEditPanel());

  const oncontextmenu = (e: MouseEvent) => {
    menu.move(e.x, e.y).show();
    e.stopPropagation();
    e.preventDefault();
  };

  const shortcutsKeeper = new ShortcutsKeeper(board, aq)
  const onkeydown = (e: KeyboardEvent) => {
    shortcutsKeeper.handleKeyboardEvent(e)
    console.log(shortcutsKeeper.shortcuts)
  }

  blackboard.current!.addEventListener('keydown', onkeydown)
  blackboard.current!.addEventListener('contextmenu', oncontextmenu)

  const init = (ttt: TTT) => {
    board.removeAll(false);
    const img_main = (board.find('img_header') ?? board.factory.newShape(ShapeEnum.Img)) as ShapeImg;
    const imgd_main = img_main.data.copy();
    imgd_main.id = 'img_header';
    imgd_main.src = ttt.main_pic.src;
    imgd_main.locked = false;
    imgd_main.x = 0;
    imgd_main.y = 0;
    imgd_main.w = resultWidth;
    imgd_main.h = resultHeight;
    imgd_main.layer = board.layer().id;
    imgd_main.objectFit = ObjectFit.Cover;
    img_main.merge(imgd_main);
    img_main.board || board.add(img_main, true);

    const img_logo = (board.find('img_logo') ?? board.factory.newShape(ShapeEnum.Img)) as ShapeImg;
    const imgd_logo = img_logo.data.copy();
    imgd_logo.id = 'img_logo';
    imgd_logo.src = ttt.logo_img.src;
    imgd_logo.w = ttt.logo_img.w;
    imgd_logo.h = ttt.logo_img.h;
    imgd_logo.x = resultWidth - ttt.logo_img.w - 15;
    imgd_logo.y = resultHeight - ttt.logo_img.h - 15;
    imgd_logo.layer = board.layer().id;
    imgd_logo.objectFit = ObjectFit.Cover;
    img_logo.merge(imgd_logo);
    img_logo.board || board.add(img_logo, true);


    const txt_main_font_size = 48
    const txt_main_offset_y = 15
    const txt_main = (board.find('txt_content') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
    const txtd_main = txt_main.data.copy();
    txtd_main.id = 'txt_content';
    txtd_main.x = 20
    txtd_main.y = txt_main_offset_y;
    txtd_main.layer = board.layer().id;
    txtd_main.font_size = txt_main_font_size;
    txtd_main.text = ttt.main_txt.text
    txt_main.merge(txtd_main);
    txt_main.board || board.add(txt_main, true);


    const txt_week_and_year_bottom = 30
    const txt_week_and_year_fontsize = 32
    const txt_date_fontsize = 128
    const now = new Date();
    const txt_date = (board.find('txt_date') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
    const txtd_date = txt_date.data.copy();
    txtd_date.id = 'txt_date'
    txtd_date.x = 20;
    txtd_date.y = resultHeight - txt_date_fontsize - txt_week_and_year_fontsize - txt_week_and_year_bottom - 8;
    txtd_date.layer = board.layer().id;
    txtd_date.font_size = txt_date_fontsize;
    txtd_date.text = '' + (now.getMonth() + 1) + '.' + now.getDate();
    txt_date.merge(txtd_date);
    txt_date.merge(txtd_date);
    txt_date.board || board.add(txt_date, true);

    const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

    const txt_week_and_year = (board.find('txt_week_and_year') ?? board.factory.newShape(ShapeEnum.Text)) as ShapeText;
    const txtd_week_and_year = txt_week_and_year.data.copy();
    txtd_week_and_year.id = 'txt_week_and_year'
    txtd_week_and_year.x = 20;
    txtd_week_and_year.y = resultHeight - txt_week_and_year_fontsize - txt_week_and_year_bottom;
    txtd_week_and_year.layer = board.layer().id;
    txtd_week_and_year.font_size = txt_week_and_year_fontsize;
    txtd_week_and_year.text = weekDay[now.getDay()] + '. ' + now.getFullYear();
    txt_week_and_year.merge(txtd_week_and_year);
    txt_week_and_year.merge(txtd_week_and_year);
    txt_week_and_year.board || board.add(txt_week_and_year, true);
  }

  interface TTT {
    main_pic: Img;
    main_txt: Txt;
    logo_img: Logo;
  }
  interface Txt { text: string; }
  interface Img { src: string; }
  interface Logo {
    src: string;
    w: number,
    h: number,
  }

  const templateText = board.factory.shapeTemplate(ShapeEnum.Text) as TextData;
  templateText.font_family = '"Microsoft YaHei", Arial, Helvetica, sans-serif';
  templateText.fillStyle = '#ffffff'
  templateText.strokeStyle = '#000000'
  templateText.font_weight = 'bold'
  templateText.lineWidth = 1

  const main_pics = new Shiftable([
    img_header_0,
    img_header_1,
    img_header_2,
    img_header_3,
  ])
  const main_txts = new Shiftable([
    '垂死病中惊坐起\n　　　　笑问客从何处来',
    '少壮不努力\n　　　　自挂东南枝叶',
    '长亭外　古道边\n　　　　一行白鹭上青天',
    'hello world',
  ]);

  const builtins = new Shiftable([{
    logo_img: { src: img_logo, w: 150, h: 150 },
    main_pic: { src: main_pics.next()! },
    main_txt: { text: main_txts.next()! }
  }, {
    logo_img: { src: img_logo, w: 150, h: 150 },
    main_pic: { src: main_pics.next()! },
    main_txt: { text: main_txts.next()! }
  }, {
    logo_img: { src: img_logo, w: 150, h: 150 },
    main_pic: { src: main_pics.next()! },
    main_txt: { text: main_txts.next()! }
  }, {
    logo_img: { src: img_logo, w: 150, h: 150 },
    main_pic: { src: main_pics.next()! },
    main_txt: { text: main_txts.next()! }
  }])
  const btnNext = new Button().init({ content: '😒', size: SizeType.Large, title: '换一个' });
  btnNext.addEventListener('click', () => {
    init(builtins.next()!);
  })
  btnNext.inner.click();

  const btnExport = new Button().init({ content: '💾', size: SizeType.Large, title: '下载' });
  btnExport.addEventListener('click', () => download())

  const btnFontSizeUp = new Button().init({ content: 'A➕', size: SizeType.Large, title: 'A↑' });
  btnFontSizeUp.disabled = true
  btnFontSizeUp.addEventListener('click', () => {
    board.selects.forEach(shape => {
      if (shape instanceof ShapeText) {
        shape.fontSize = shape.fontSize + 1;
      }
    })
  })

  const btnFontSizeDown = new Button().init({ content: 'A➖', size: SizeType.Large, title: 'A↓' });
  btnFontSizeDown.disabled = true
  btnFontSizeDown.addEventListener('click', () => {
    board.selects.forEach(shape => {
      if (shape instanceof ShapeText) {
        shape.fontSize = Math.max(12, shape.fontSize - 1);
      }
    })
  })

  const btnLineWidthUp = new Button().init({ content: 'L➕', size: SizeType.Large, title: 'A↑' });
  btnLineWidthUp.disabled = true
  btnLineWidthUp.addEventListener('click', () => {
    board.selects.forEach(shape => {
      if (shape.data.needStroke) {
        shape.lineWidth = shape.lineWidth + 1;
      }
    })
  })

  const btnRemove = new Button().init({ content: '🗑️', size: SizeType.Large, title: '移除' });
  btnRemove.addEventListener('click', () => { board.removeSelected(true) })

  const btnToolPen = new Button().init({ content: '✒️', size: SizeType.Large, title: '工具：笔' });
  btnToolPen.addEventListener('click', () => { board.setToolType(ToolEnum.Pen) })

  const btnToolTxt = new Button().init({ content: '💬', size: SizeType.Large, title: '工具：文本' });
  btnToolTxt.addEventListener('click', () => { board.setToolType(ToolEnum.Text) })

  const btnToolRect = new Button().init({ content: '⬜', size: SizeType.Large, title: '工具：矩形' });
  btnToolRect.addEventListener('click', () => { board.setToolType(ToolEnum.Rect) })

  const btnToolOval = new Button().init({ content: '⚪', size: SizeType.Large, title: '工具：椭圆' });
  btnToolOval.addEventListener('click', () => { board.setToolType(ToolEnum.Oval) })

  const btnToolSelector = new Button().init({ content: '🖱️', size: SizeType.Large, title: '工具：选择器' });
  btnToolSelector.addEventListener('click', () => { board.setToolType(ToolEnum.Selector) })

  new ButtonGroup({
    buttons: [btnToolPen, btnToolTxt, btnToolRect, btnToolOval, btnToolSelector]
  })

  const btnLineWidthDown = new Button().init({ content: 'L➖', size: SizeType.Large, title: 'A↓' });
  btnLineWidthDown.disabled = true
  btnLineWidthDown.addEventListener('click', () => {
    board.selects.forEach(shape => {
      if (shape.data.needStroke) {
        shape.lineWidth = shape.lineWidth - 1;
      }
    })
  })
  const btnRotate1 = new Button().init({ content: '↺18°', size: SizeType.Large, title: '↺18°' });
  btnRotate1.addEventListener('click', () => {
    board.selects.forEach(shape => shape.rotateBy(-Math.PI / 4))
  })

  const btnRotate2 = new Button().init({ content: '↻18°', size: SizeType.Large, title: '↻18°' });
  btnRotate2.addEventListener('click', () => {
    board.selects.forEach(shape => shape.rotateBy(Math.PI / 10))
  })

  const bottomRow = new View('div');
  bottomRow.styles.addCls('g_cp_content_bottom_row')
  bottomRow.addChild(
    btnRemove,
    btnToolPen,
    btnToolTxt,
    btnToolRect,
    btnToolOval,
    btnToolSelector,
    btnFontSizeUp,
    btnFontSizeDown,
    btnLineWidthUp,
    btnLineWidthDown,
    btnRotate1,
    btnRotate2,
    btnNext,
    btnExport,
  )

  bottomRow.addEventListener('pointerdown', e => e.stopPropagation())
  mainView.current!.addChild(bottomRow);

  const download = () => {
    board.deselect(true);
    requestAnimationFrame(() => {
      const l = board.layer().onscreen;
      const c = document.createElement('canvas');
      c.width = l.width;
      c.height = l.height;
      c.getContext('2d')!.fillStyle = 'white';
      c.getContext('2d')!.fillRect(0, 0, l.width, l.height)
      c.getContext('2d')!.drawImage(l, 0, 0, l.width, l.height);
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = '' + Date.now() + '.png';
      a.click();
    })
  }

  board.setToolType(ToolEnum.Selector);

  Object.assign(window, {
    board, factory, mainView, Gaia, menu,
    gim: Gim,
    record: {
      who: rec,
      start: () => rec.stop().start(),
      stop: () => rec.stop()
    },
    player: {
      who: sc,
      play: () => {
        rec.stop();
        const sp = rec.getScreenplay();
        sp && sc.play(board, sp);
      },
      stop: () => sc.stop()
    },
    actions: {
      who: aq,
      undo: () => aq.undo(),
      redo: () => aq.redo(),
    }
  });
}
addEventListener('load', () => main(), { once: true })
