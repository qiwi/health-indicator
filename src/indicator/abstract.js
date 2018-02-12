// @flow

import Health from '../health'
import {mapValues, find} from '../base'
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
    const status = this.getStatus() || 'OK'
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
  }

  getCritical (): boolean {
    return false
  }

  getDeps (): IIndicatorDeps | void {
  }

  getExtra (): any {
    return this.extra
  }

  static resolveCritical (deps) {
    return !!find(deps, ({critical}) => critical === true)
  }

  static resolveStatus (deps, order) {
    return 'OK'
  }
}
