// @flow

import type {IHealth, IHealthExtra} from '../health/interface'

export interface IPrimitiveIndicator {
  status: string | void,
  health(): IHealth
}

export interface IIndicator extends IPrimitiveIndicator {
  critical: boolean | void,
  deps?: IIndicatorDeps,
  extra?: IHealthExtra,
  constructor(opts: IIndicatorOpts): IIndicator,
  getCritical(): boolean,
  getStatus(): string,
  getDeps(): IIndicatorDeps | void,
  getExtra(): any
}

// WTF is going on: https://github.com/facebook/flow/pull/3994
export interface IIndicatorStatics {
  getDefaultStatus(): string,
  getDefaultCritical(): boolean,
  getSeverityOrder(): string[],
  getStatusMap(): IStatusMap,
  getHttpMap(): IHttpMap,
  getDefaultHttpCode(): number,
  getHttpCode(status: string): number,
  resolveCriticalFromDeps(deps:? IIndicatorDeps, def: boolean): boolean,
  resolveStatusFromDeps(deps:? IIndicatorDeps, order: string[], def: string): string,
  getLowestStatus(deps: IIndicatorDeps, order: string[]): string,
  getHighestStatus(deps: IIndicatorDeps, order: string[]): string
}

export type IIndicatorOpts = {
  critical: boolean,
  status?: string,
  deps: IIndicatorDeps,
  extra: IHealthExtra,
}

export type IIndicatorDeps = {
  [key: string]: IIndicator | IPrimitiveIndicator,
} | void

export type IHttpMap = {
  [key: string]: number;
}

export type IStatusMap = {
  [key: string]: string;
}
