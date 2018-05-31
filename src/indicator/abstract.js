// @flow

import Health from '../health'
import {mapValues, find, minBy, maxBy, toArray, isEmpty, isDefined, pickBy} from '../base'
import type {IIndicator, IIndicatorOpts, IIndicatorDeps, IHttpMap, IStatusMap} from './interface'
import type {IHealth, IHealthDeps, IHealthExtra} from '../health/interface'

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
  constructor ({ critical, status, deps, extra }: IIndicatorOpts = {}): IIndicator {
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
  deps: IIndicatorDeps
  extra: IHealthExtra

  /**
   * @returns {Health}
   */
  health (): IHealth {
    const status = this.getStatus()
    const critical = this.getCritical()
    const deps: IHealthDeps = mapValues(this.getDeps(), dep => dep.health())
    const extra:? any = this.getExtra()

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

  getExtra (): IHealthExtra {
    return this.extra
  }

  static getDefaultStatus (): string {
    return UNKNOWN
  }

  static getSeverityOrder (): string[] {
    return [UNKNOWN]
  }

  static getStatusMap (): IStatusMap {
    return {UNKNOWN}
  }

  // TODO separate to endpoint class
  static getHttpMap (): IHttpMap {
    return {
      [UNKNOWN]: DEFAULT_HTTP_CODE
    }
  }

  static getDefaultHttpCode (): number {
    return DEFAULT_HTTP_CODE
  }

  static getHttpCode (status: string): number {
    const codeMap: IHttpMap = this.getHttpMap()
    const defCode: number = this.getDefaultHttpCode()
    const code: number | void = codeMap[status]

    return code || defCode
  }

  // TODO separate resolver logic to aggregator class
  static resolveCritical (deps:? IIndicatorDeps): boolean {
    return !!find(deps, dep => dep.getCritical())
  }

  static resolveStatus (deps:? IIndicatorDeps, order: string[], def: string): string {
    if (deps === undefined || deps === null || isEmpty(deps)) {
      return def
    }

    const criticalDeps: IIndicatorDeps = pickBy(deps, dep => dep.getCritical())
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
  static getLowestStatus (deps: IIndicatorDeps, order: string[]=[]): string {
    const depsArray: IIndicator[] = toArray(deps)
    return minBy(depsArray, dep => order.indexOf(dep.getStatus())).getStatus()
  }

  /**
   * @param {IIndicatorDeps} deps
   * @param {string[]} order
   * @returns {string/null}
   */
  static getHighestStatus (deps: IIndicatorDeps, order: string[]=[]): string {
    const depsArray: IIndicator[] = toArray(deps)
    return maxBy(depsArray, dep => order.indexOf(dep.getStatus())).getStatus()
  }
}

