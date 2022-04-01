import * as lodash from 'lodash'
const {
  extend,
  minBy,
  maxBy,
  find,
  isEmpty,
  mapValues,
  toArray,
  pickBy,
} = (lodash as any).default || lodash

export {
  extend,
  minBy,
  maxBy,
  find,
  isEmpty,
  mapValues,
  toArray,
  pickBy,
}

export function isDefined (value?: any): boolean {
  return value !== undefined
}
