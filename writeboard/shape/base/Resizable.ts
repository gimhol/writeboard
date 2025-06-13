/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */

export enum Resizable {
    /** 禁止 */ None = 0b000,
    /** 水平 */ Horizontal = 0b001,
    /** 垂直 */ Vertical = 0b010,
    /** 四角 */ Corner = 0b100,
    /** 八向 */ All = 0b111
}
