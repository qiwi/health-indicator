import { find, isDefined, isEmpty, mapValues, maxBy, minBy, pickBy, toArray } from '../base'
import { OK } from '../endpoint/statuses'
import { Health } from '../health'
import { IHealth, IHealthDeps, IHealthExtra } from '../health/interface'
import {
  IHttpMap,
  IIndicator,
  IIndicatorDeps,
  IIndicatorOpts,
  IIndicatorStatics,
  IStatusMap,
} from './interface'

export const UNKNOWN = 'UNKNOWN'
export const DEFAULT_CRITICAL = false
export const DEFAULT_STATUS = UNKNOWN
export const DEFAULT_HTTP_CODE = OK
export const SEVERITY_ORDER = [UNKNOWN]
export const HTTP_MAP = {
  [UNKNOWN]: DEFAULT_HTTP_CODE,
}

/**
 * Abstract indicator class
 * @class AbstractIndicator
 * @param {IIndicatorOpts} opts
 * @abstract
 * @implements IIndicator
 * @returns {IIndicator}
 */
export class AbstractIndicator implements IIndicator {
  /**
   * @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
   */
  ['constructor']: typeof AbstractIndicator & IIndicatorStatics

  constructor ({ critical, status, deps, extra }: IIndicatorOpts = {}) {
    // @ts-ignore
    if (this.constructor === AbstractIndicator) {
      throw new Error('Abstract cannot be instantiated')
    }

    this.status = status
    this.critical = critical
    this.deps = deps
    this.extra = extra

    return this
  }

  status: string | undefined
  critical: boolean | undefined
  deps: IIndicatorDeps
  extra: IHealthExtra

  /**
   * @returns {Health}
   */
  health (): IHealth {
    const status = this.getStatus()
    const critical = this.getCritical()
    const deps: IHealthDeps = mapValues(this.getDeps(), (dep: IIndicator) => dep.health())
    const extra: any = this.getExtra()

    return new Health({
      status,
      critical,
      deps,
      extra,
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

    return this.constructor.resolveStatusFromDeps(
      this.getDeps(),
      this.constructor.getSeverityOrder(),
      this.constructor.getDefaultStatus(),
    )
  }

  /**
   * @returns {boolean}
   */
  getCritical (): boolean {
    if (isDefined(this.critical)) {
      return !!this.critical
    }

    return this.constructor.resolveCriticalFromDeps(
      this.getDeps(),
      this.constructor.getDefaultCritical(),
    )
  }

  /**
   * Returns indicator dependencies map
   * @returns {IIndicatorDeps|void}
   */
  getDeps (): IIndicatorDeps | undefined {
    return this.deps
  }

  getExtra (): IHealthExtra {
    return this.extra
  }

  static getDefaultStatus (): string {
    return DEFAULT_STATUS
  }

  static getDefaultCritical (): boolean {
    return DEFAULT_CRITICAL
  }

  static getSeverityOrder (): string[] {
    return SEVERITY_ORDER
  }

  static getStatusMap (): IStatusMap {
    return { UNKNOWN }
  }

  // TODO separate to endpoint class
  static getHttpMap (): IHttpMap {
    return HTTP_MAP
  }

  static getDefaultHttpCode (): number {
    return DEFAULT_HTTP_CODE
  }

  static getHttpCode (status?: string): number {
    const codeMap: IHttpMap = this.getHttpMap()
    const defCode: number = this.getDefaultHttpCode()
    const code: number | undefined = status ? codeMap[status] : undefined

    return code || defCode
  }

  static resolveCriticalFromDeps (deps: IIndicatorDeps | undefined, def: boolean): boolean {
    if (deps === undefined || deps === null || isEmpty(deps)) {
      return !!def
    }

    return !!find(deps, (dep: IIndicator) => dep.health().critical)
  }

  static resolveStatusFromDeps (deps: IIndicatorDeps | undefined, order: string[], def?: string): string {
    if (deps === undefined || deps === null || isEmpty(deps)) {
      return '' + def
    }

    const criticalDeps: IIndicatorDeps = pickBy(deps, (dep: IIndicator) => dep.health().critical)
    if (!isEmpty(criticalDeps)) {
      return this.getLowestStatus(criticalDeps, order)
    }

    return this.getHighestStatus(deps, order)
  }

  /**
 * @param {IIndicatorDeps} deps
 * @param {string[]=SEVERITY_ORDER} order
 * @returns {string/null}
 */
  static getLowestStatus (deps: IIndicatorDeps, order?: string[], defaultStatus = DEFAULT_STATUS): string {
    const depsArray: IIndicator[] = toArray(deps)
    const _order = order || this.getSeverityOrder()

    return minBy(depsArray, (dep: IIndicator) => {
      const index = _order.indexOf(dep.health().status)

      return index === -1
        ? Infinity
        : index
    })?.health().status ?? defaultStatus
  }

  /**
 * @param {IIndicatorDeps} deps
 * @param {string[]=SEVERITY_ORDER} order
 * @returns {string/null}
 */
  static getHighestStatus (deps: IIndicatorDeps, order?: string[], defaultStatus = DEFAULT_HTTP_CODE): string {
    const depsArray: IIndicator[] = toArray(deps)
    const _order = order || this.getSeverityOrder()

    return maxBy(depsArray, (dep: IIndicator) => {
      const index = _order.indexOf(dep.health().status)

      return index === -1
        ? -Infinity
        : index
    })?.health().status ?? defaultStatus.toString()
  }
}
