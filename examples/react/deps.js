/**
 * 依赖汇总：React / ReactDOM 由 UMD 全局提供（见 index.html 的 CDN script），
 * writeboard 以 ES module 从 ../lib 引入，其它模块统一从这里取，
 * 免得每个文件都重复写一遍 import。
 */
export { ActionQueue, EventEnum, FactoryEnum, Gaia, ShapeEnum, ToolEnum } from '../lib/writeboard.js'

export const { useCallback, useEffect, useReducer, useRef, useState } = React
