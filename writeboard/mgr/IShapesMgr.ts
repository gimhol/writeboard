import { Shape } from "../shape/base/Shape"
import { IRotatedRect } from "../utils/IRotatedRect"

export interface IHitPredicate {
  (shape: Shape, rect: IRotatedRect): any
}
export interface IShapesMgr {
  /**
   * 查找指定ID的图形
   *
   * @param {string} id 指定ID
   * @return {(Shape | null)} 存在时，返回图形，否则返回undefined
   * @memberof IShapesMgr
   */
  find(id: string): Shape | null

  /**
   * 获取全部图形
   *
   * @return {Shape[]} 全部图形
   * @memberof IShapesMgr
   */
  shapes(): Shape[]


  add(...items: Shape[]): number

  remove(...items: Shape[]): number

  exists(...items: Shape[]): number

  hit(rect: IRotatedRect, predicate?: IHitPredicate): Shape | null

  hits(rect: IRotatedRect, predicate?: IHitPredicate): Shape[]
}

