/**
 * 沿停靠边把 n 个小画面排成一行（照搬 demo 的 get_horizontal / vertical_distribution）：
 * 每个格子尺寸固定，整排按对齐方式（前 / 中 / 后）贴着停靠带摆。
 */
export function distributeAlong(count, zone, cell, horizontal, align) {
  if (count <= 0) return []
  const size = horizontal ? cell.w : cell.h
  const span = horizontal ? zone.w : zone.h
  const offset = (span - size * count) * align
  const rects = []
  for (let i = 0; i < count; i++) {
    const at = offset + i * size
    rects.push(horizontal
      ? { x: zone.x + at, y: zone.y, w: size, h: zone.h }
      : { x: zone.x, y: zone.y + at, w: zone.w, h: size })
  }
  return rects
}

/** 自由区：整块黑板减去停靠带（对应 demo 的 drop_main_zone） */
export function zoneMinus(full, strip, edge) {
  if (edge === 'top') return { x: full.x, y: full.y + strip.h, w: full.w, h: full.h - strip.h }
  if (edge === 'bottom') return { x: full.x, y: full.y, w: full.w, h: full.h - strip.h }
  if (edge === 'left') return { x: full.x + strip.w, y: full.y, w: full.w - strip.w, h: full.h }
  return { x: full.x, y: full.y, w: full.w - strip.w, h: full.h }
}

/**
 * 自由区里 n 个最大化窗口怎么摆（照搬 demo 的 get_fill_distribution）：
 * 1 个铺满；2 个左右均分；3 个三列；4 个 2×2；5 个上行 2 个 + 下行 3 个；8 个 4 列 2 行。
 */
export function fillRects(num, zone) {
  if (num <= 0) return []
  const row = Math.floor(Math.sqrt(num))
  let col = Math.ceil(num / row)
  const cols = []
  let left = num
  if (num > 1 && num - row * (col - 1) === 1) {
    col -= 1
    while (left > 1) {
      cols.push(col + 1 === left ? left : col)
      left -= col
    }
  } else {
    while (left > 0) {
      cols.push(col < left ? col : left)
      left -= col
    }
  }
  const cellH = zone.h / row
  const rects = []
  cols.forEach((count, iy) => {
    const cellW = zone.w / count
    for (let ix = 0; ix < count; ix++) {
      rects.push({
        x: zone.x + ix * cellW,
        y: zone.y + iy * cellH,
        w: cellW,
        h: cellH,
      })
    }
  })
  return rects
}
