// @flow

import type {IHealth, IHealthExtra} from '../health/interface'

export interface IIndicator {
  critical: boolean;
  status: string | void;
  deps: IIndicatorDeps | void;
  extra: IHealthExtra | void;

  constructor(opts: IIndicatorOpts): IIndicator;

  health(): IHealth;

  getCritical(): boolean | void;

  getStatus(): string | void;

  getDeps(): IIndicatorDeps | void;

  getExtra(): any;

  // static resolveStatus(deps?: IIndicatorDeps): string;

  // static resolveCritical(deps?: IIndicatorDeps): boolean;
}

export type IIndicatorOpts = {
  critical: boolean,
  status?: string,
  deps?: IIndicatorDeps,
  extra?: IHealthExtra,
}

export type IIndicatorDeps = {
  [key: string]: IIndicator,
} | void
