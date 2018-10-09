// @flow

export {
  extend,
  minBy,
  maxBy,
  each,
  find,
  isEmpty,
  isUndefined,
  isObject,
  isString,
  isFunction,
  mapValues,
  toArray,
  pickBy
} from 'lodash-es'

export function isDefined (value ?: any): boolean {
  return value !== undefined
}
