// @flow

import Health from '../health'
import {mapValues, find, isDefined, minBy, maxBy, filter} from '../base'
import type {IIndicator, IIndicatorOpts, IIndicatorDeps} from './interface'
import type {IHealth} from '../health/interface'

/**
 * Abstract indicator class
 * @class AbstractIndicator
 * @param {IIndicatorOpts} opts
 * @abstract
 * @implements IIndicator
 * @returns {IIndicator}
 */
export default class AbstractIndicator implements IIndicator {
  constructor ({critical, status, deps, extra}: IIndicatorOpts): IIndicator {
    if (this.constructor === AbstractIndicator) {
      throw new Error('Abstract cannot be instantiated')
    }

    this.status = status
    this.critical = !!critical
    this.deps = deps
    this.extra = extra

    return this
  }

  status: string | void
  critical: boolean
  deps: IIndicatorDeps | void
  extra: any

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

  getStatus (): string | void {
    if (this.status) {
      return this.status
    }

    if (this.deps) {
      return this.constructor.resolveStatus(this.deps)
    }

    return 'OK';
  }

  getCritical (): boolean {
    return isDefined(this.critical)
      ? this.critical
      : this.constructor.resolveCritical()
  }

  getDeps (): IIndicatorDeps | void {
  }

  getExtra (): any {
    return this.extra
  }

  static resolveCritical (deps: any) {
    return !!find(deps, dep => dep.getCritical())
  }

  static resolveStatus (deps: any, order: any) {
    if (!deps) {
      return 'OK';
    }

    const criticalDeps = filter(deps, dep => dep.getCritical());
    if (criticalDeps.keys().length) {
      return this.getLowestStatus(criticalDeps, order);
    }
    //console.log('!!!!', deps)
    return this.getHighestStatus(deps, order);
  }

  /**
   * @param {IIndicatorDeps} deps
   * @param {string[]} order
   * @returns {string/null}
   */
  static getLowestStatus(deps: any, order:any=[]) {
    return minBy(deps, dep => order.indexOf(dep.getStatus()));
  }

  /**
   * @param {IIndicatorDeps} deps
   * @param {string[]} order
   * @returns {string/null}
   */
  static getHighestStatus(deps: any, order:any=[]) {
    return maxBy(deps, dep => order.indexOf(dep.getStatus()));
  }

}
