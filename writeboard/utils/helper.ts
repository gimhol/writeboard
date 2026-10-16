/**
 * 判断一个值是不是数字
 *
 * Whether a value is a number.
 *
 * @param {any} x 待检查的值 / The value to check
 * @return {boolean} 是数字时返回 true / True when it is a number
 */
export const isNum = (x: any): x is number => typeof x === 'number'
/**
 * 判断一个值是不是字符串
 *
 * Whether a value is a string.
 *
 * @param {any} x 待检查的值 / The value to check
 * @return {boolean} 是字符串时返回 true / True when it is a string
 */
export const isStr = (x: any): x is string => typeof x === 'string'

/**
 * 在对象里按值反查键（键顺序即 Object.keys 的顺序）
 *
 * Looks the key of a value up in an object (keys follow the Object.keys order).
 *
 * @param {any} obj 待查找的对象 / Object to search
 * @param {any} value 目标值 / Value to look for
 * @return {string | undefined} 命中的键，没找到时为 undefined / The matching key, or undefined when nothing matches
 */
export const findKey = (obj: any, value: any) => Object.keys(obj).find(k => obj[k] === value);
/**
 * 生成「枚举值 → 名字」的函数：找到对应键时给出 “枚举名.键名”，否则退化为字符串化的值
 *
 * Builds an “enum value → name” getter: it yields “enumName.key” when the key is
 * found, otherwise it falls back to the stringified value.
 *
 * @param {string} name 枚举名 / Enum name
 * @param {any} e 枚举对象 / The enum object
 * @return {(value: T) => string} 取值函数 / The getter
 */
export const enumNameGetter = <T>(name: string, e: any) => (value: T) => {
  const k = findKey(e, value)
  return isStr(k) ? `${name}.${k}` : '' + value;
}