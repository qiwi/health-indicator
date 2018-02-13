// @flow

export {
  extend,
  min,
  minBy,
  maxBy,
  map,
  each,
  find,
  filter,
  isEmpty,
  isUndefined,
  isObject,
  isString,
  isFunction,
  mapValues,
  toArray
} from 'lodash-es'

export function isDefined (value: any): boolean {
  return value !== undefined
}
