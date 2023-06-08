import { View } from "../BaseView/View";
import { DragInOutOB } from "../Observer/DragInOutOB";
import { Subwin } from "./Subwin";
export interface SubwinTabInits {
  title: string;
  color: string;
}
export class SubwinTab extends View<'div'>{
  constructor(inits: SubwinTabInits) {
    super('div');
    this.styles.applyCls('subwin_tab').apply('_', {
      backgroundColor: inits.color,
      marginTop: 5,
      paddingLeft: 5,
      paddingRight: 5,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'center',
      marginRight: 1
    })
    this.inner.append(inits.title);
    this.inner.draggable = true;
    this.inner.addEventListener('dragstart', (e) => {
    })
    // this.inner.addEventListener('dragend', (e) => console.log('[SubwinTab]', e.type, inits.title))
    // this.inner.addEventListener('drag', (e) => console.log('[SubwinTab]', e.type, e))
    this.inner.addEventListener('dragover', (e) => {
      // if (e.target === this.inner) { return; }
      // console.log('[SubwinTab]', e.type, inits.title)
    })
  }
}

export class MergedSubwin extends Subwin {
  private subwins: Subwin[] = [];
  private tabs = new Map<Subwin, SubwinTab>();
  private activedSubwin?: Subwin;
  private _dragOutOB: DragInOutOB;

  constructor() {
    super();
    this.header.styles
    const onDragIn = (e: DragEvent, ele: HTMLElement) => {
      console.log(ele.innerHTML, 'in')
    }
    const onDragOut = (e: DragEvent, ele: HTMLElement) => {
      console.log(ele.innerHTML, 'out')
    }
    this._dragOutOB = new DragInOutOB({
      ele: this.header.titleView.inner,
      onDragOut,
      onDragIn,
    });


    this.header.iconView.inner.innerHTML = '▨';

    this.content = new View('div');
    this.content?.styles.apply('_', {
      position: 'relative',
      flex: 1,
      minWidth: '250px',
      minHeight: '200px',
    });
    this.styles.apply('normal', v => ({
      ...v
    }));
    this.removeChild(this.footer);
    this.header.titleView.styles.apply('_', {
      display: 'flex',
      overflow: 'hidden'
    })
  }
  removeSubwin(subwin: Subwin) {
    const idx = this.subwins.indexOf(subwin)
    if (idx < 0) { return; }
    this.subwins.splice(idx, 1);
    subwin.styles.forgo('merged');
    subwin.header.styles.forgo('merged');

  }
  addSubWin(subwin: Subwin) {
    if (this.subwins.indexOf(subwin) >= 0) { return; }
    this.subwins.push(subwin);
    subwin.styles.apply('merged', {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      border: 'none',
      boxShadow: 'none',
      resize: 'none'
    });
    subwin.header.styles.apply('merged', { display: 'none' });

    this.content?.addChild(subwin);
    const tab = new SubwinTab({
      title: subwin.header.title,
      color: '#555555'
    })
    this.header.titleView.addChild(tab);
    this.tabs.set(subwin, tab);
    this.activedSubwin = subwin;
    const handleClick = () => {
      this.tabs.forEach((v, subwin) => {
        if (v === tab) {
          v.styles.forgo('disactived');
          subwin.styles.forgo('disactived');
        } else {
          v.styles.apply('disactived', { opacity: '0.5' });
          subwin.styles.apply('disactived', { display: 'none' });
        }
      })
    }

    this._dragOutOB.addDraggble(tab.inner);
    this.dragger.ignores?.push(tab)
    tab.addEventListener('click', handleClick)
    handleClick();
  }
}
