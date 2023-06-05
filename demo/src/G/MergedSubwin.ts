import { View } from "./View";
import { Subwin } from "./Subwin";
export interface SubwinTabInits {
  title: string;
  color: string;
}
export class SubwinTab extends View<'div'>{
  constructor(inits: SubwinTabInits) {
    super('div');
    this.styleHolder().applyStyle('', {
      backgroundColor: inits.color,
      marginTop: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
      alignSelf: 'stretch',
      display: 'flex',
      alignItems: 'center',
      marginRight: '1px'
    })
    this.inner.append(inits.title);
  }
}
export class MergedSubwin extends Subwin {
  private subwins: Subwin[] = [];
  private tabs = new Map<Subwin, SubwinTab>();
  private activedSubwin?: Subwin;
  constructor() {
    super();
    this.header.iconView.inner.innerHTML = '▨';
    this.content = new View('div');
    this.content?.styleHolder().applyStyle('', {
      position: 'relative',
      flex: 1,
      minWidth: '250px',
      minHeight: '200px',
    });
    this.styleHolder().applyStyle('normal', v => ({
      ...v
    }));
    this.removeChild(this.footer);
    this.header.titleView.styleHolder().applyStyle('', {
      display: 'flex',
      overflow: 'hidden'
    })
  }
  addSubWin(subwin: Subwin) {
    if (this.subwins.indexOf(subwin) >= 0) { return; }
    this.subwins.push(subwin);

    subwin.styleHolder().applyStyle('merged', {
      position: 'absolute',
      left: '0px',
      right: '0px',
      top: '0px',
      bottom: '0px',
      width: '100%',
      height: '100%',
      border: 'none',
      boxShadow: 'none',
      resize: 'none'
    });
    subwin.header.styleHolder().applyStyle('merged', { display: 'none' });
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
          v.styleHolder().forgoStyle('disactived');
          subwin.styleHolder().forgoStyle('disactived');
        } else {
          v.styleHolder().applyStyle('disactived', { opacity: '0.5' });
          subwin.styleHolder().applyStyle('disactived', { display: 'none' });
        }
      })
    }
    this.header.dragger.ignores.push(tab.inner)
    tab.onClick(handleClick)
    handleClick();
  }
}
