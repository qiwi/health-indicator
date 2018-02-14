import {Predicate} from "lodash-es"

declare module 'lodash-es' {
  declare type Predicate<T> = (T) => any

  declare export function isEmpty (v: any): boolean
  declare export function isString (v: any): boolean
  declare export function isUndefined (v: any): boolean
  declare export function isObject (v: any): boolean
  declare export function isFunction (v: any): boolean
  declare export function toArray (value: any): Array<any>
  declare export function filter<V>(value?: ?V, fn: Function): V
  declare export function mapValues<V>(value: ?V, fn: Function): any
  declare export function extend<A, B>(a?: ?A, b?: ?B): A & B
  declare export function minBy<T>(array: Array<T>, iteratee: Predicate<T>): T
  declare export function maxBy<T>(array: Array<T>, iteratee: Predicate<T>): T
  declare export function find<T>(
    collection: T,
    predicate: Function
  ): T | void
  declare export function each<T>(
    v: any,
    iteratee: Function
  ): void

}