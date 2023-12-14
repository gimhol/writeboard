
export namespace Css {
  const style_element_id = 'g_whiteboard_styles'
  
  export function add(style: string) {
    let ele = document.getElementById(style_element_id)
    if (!ele || ele.tagName !== 'STYLE') {
      ele = document.createElement('style')
      ele.id = style_element_id
      document.head.append(ele);
    }
    ele.innerHTML += style;
  }
}


