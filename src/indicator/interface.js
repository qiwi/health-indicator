// @flow

import type {IHealth, IHealthExtra} from '../health/interface'

export interface IIndicator {
  critical: boolean | void,
  status: string | void,
  deps: IIndicatorDeps,
  extra: IHealthExtra,
  constructor(opts: IIndicatorOpts): IIndicator,
  health(): IHealth,
  getCritical(): boolean,
  getStatus(): string,
  getDeps(): IIndicatorDeps | void,
  getExtra(): any
}
// WTF is going on: https://github.com/facebook/flow/pull/3994
export interface IIndicatorStatics {
  getDefaultStatus(): string,
  getSeverityOrder(): string[],
  getStatusMap(): IStatusMap,
  getHttpMap(): IHttpMap,
  getDefaultHttpCode(): number,
  getHttpCode(status: string): number,
  resolveCritical(deps:? IIndicatorDeps): boolean,
  resolveStatus(deps:? IIndicatorDeps, order: string[], def: string): string,
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
  [key: string]: IIndicator,
} | void

export type IHttpMap = {
  [key: string]: number;
}

export type IStatusMap = {
  [key: string]: string;
}
