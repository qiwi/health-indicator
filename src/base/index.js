// @flow

export {
  extend,
  minBy,
  maxBy,
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

export function isDefined (value ?: any): boolean {
  return value !== undefined
}
