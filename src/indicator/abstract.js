// @flow

import Health from '../health'
import {mapValues, find, minBy, maxBy, filter, toArray, isEmpty, isDefined} from '../base'
import type {IIndicator, IIndicatorOpts, IIndicatorDeps} from './interface'
import type {IHealth} from '../health/interface'

export const UNKNOWN = 'UNKNOWN'
export const DEFAULT_HTTP_CODE = 200

/**
 * Abstract indicator class
 * @class AbstractIndicator
 * @param {IIndicatorOpts} opts
 * @abstract
 * @implements IIndicator
 * @returns {IIndicator}
 */
export default class AbstractIndicator implements IIndicator {
  constructor ({ critical, status, deps, extra }: IIndicatorOpts): IIndicator {
    if (this.constructor === AbstractIndicator) {
      throw new Error('Abstract cannot be instantiated')
    }

    this.status = status
    this.critical = critical
    this.deps = deps
    this.extra = extra

    return this
  }

  status: string | void
  critical: boolean | void
  deps: IIndicatorDeps | void
  extra: any

  /**
   * @returns {Health}
   */
  health (): IHealth {
    const status = this.getStatus()
    const critical = this.getCritical()
    const deps = mapValues(this.getDeps(), dep => dep.health())
    const extra = this.getExtra()

    return new Health({
      status,
      critical,
      deps,
      extra
    })
  }

  /**
   * Returns health status
   * @returns {string}
   */
  getStatus (): string {
    if (this.status) {
      return this.status
    }

    return this.constructor.resolveStatus(this.deps, [], this.constructor.getDefaultStatus())
  }

  /**
   * @returns {boolean}
   */
  getCritical (): boolean {
    return isDefined(this.critical)
      ? !!this.critical
      : this.constructor.resolveCritical(this.getDeps())
  }

  /**
   * Returns indicator dependencies map
   * @returns {IIndicatorDeps|void}
   */
  getDeps (): IIndicatorDeps | void {
    return this.deps
  }

  getExtra (): any {
    return this.extra
  }

  static getDefaultStatus (): string {
    return UNKNOWN
  }

  static getSeverityOrder (): string[] {
    return [UNKNOWN]
  }

  static getStatusMap (): Object {
    return {UNKNOWN}
  }

  // TODO separate to endpoint class
  static getHttpMap (): Object {
    return {
      [UNKNOWN]: DEFAULT_HTTP_CODE
    }
  }

  static getDefaultHttpCode () {
    return DEFAULT_HTTP_CODE
  }

  static getHttpCode (status: string): number {
    return this.getHttpMap()[status] || this.getDefaultHttpCode()
  }

  // TODO separate resolver logic to aggregator class
  static resolveCritical (deps: any): boolean {
    return !!find(deps, dep => dep.getCritical())
  }

  static resolveStatus (deps: any, order: any, def: string): string {
    if (isEmpty(deps)) {
      return def
    }

    const criticalDeps = filter(deps, dep => dep.getCritical())
    if (!isEmpty(criticalDeps)) {
      return this.getLowestStatus(criticalDeps, order)
    }

    return this.getHighestStatus(deps, order)
  }

  /**
   * @param {IIndicatorDeps} deps
   * @param {string[]} order
   * @returns {string/null}
   */
  static getLowestStatus (deps: any, order:any=[]) {
    return minBy(toArray(deps), dep => order.indexOf(dep.getStatus())).getStatus()
  }

  /**
   * @param {IIndicatorDeps} deps
   * @param {string[]} order
   * @returns {string/null}
   */
  static getHighestStatus (deps: any, order:any=[]) {
    return maxBy(toArray(deps), dep => order.indexOf(dep.getStatus())).getStatus()
  }
}
