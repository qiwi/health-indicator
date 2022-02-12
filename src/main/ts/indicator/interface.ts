import { IConstructor } from '@qiwi/substrate'

import { IHealth, IHealthExtra } from '../health/interface'

export interface IPrimitiveIndicator {
  /**
   * @see https://github.com/Microsoft/TypeScript/issues/3841#issuecomment-337560146
   */
  ['constructor']: IConstructor & IIndicatorStatics,
  status: string | undefined,

  health (): IHealth
}

export interface IIndicator extends IPrimitiveIndicator {
  critical: boolean | undefined,
  deps?: IIndicatorDeps,
  extra?: IHealthExtra,

  getCritical (): boolean,

  getStatus (): string,

  getDeps (): IIndicatorDeps | undefined,

  getExtra (): any
}

export interface IIndicatorStatics {
  getDefaultStatus (): string,

  getDefaultCritical (): boolean,

  getSeverityOrder (): string[],

  getStatusMap (): IStatusMap,

  getHttpMap (): IHttpMap,

  getDefaultHttpCode (): number,

  getHttpCode (status: string): number,

  resolveCriticalFromDeps (deps: IIndicatorDeps | undefined, def: boolean): boolean,

  resolveStatusFromDeps (deps: IIndicatorDeps | undefined, order: string[], def: string): string,

  getLowestStatus (deps: IIndicatorDeps, order: string[]): string,

  getHighestStatus (deps: IIndicatorDeps, order: string[]): string
}

export type IIndicatorOpts = {
  critical?: boolean,
  status?: string,
  deps?: IIndicatorDeps,
  extra?: IHealthExtra,
}

export type IIndicatorDeps = {
  [key: string]: IIndicator
} | undefined

export type IHttpMap = {
  [key: string]: number;
}

export type IStatusMap = {
  [key: string]: string;
}
