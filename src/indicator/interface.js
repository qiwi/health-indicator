// @flow

import type {IHealth, IHealthExtra} from '../health/interface'

export interface IIndicator {
  critical: boolean | void;
  status: string | void;
  deps: IIndicatorDeps | void;
  extra: IHealthExtra | void;

  constructor(opts: IIndicatorOpts): IIndicator;

  health(): IHealth;

  getCritical(): boolean;

  getStatus(): string;

  getDeps(): IIndicatorDeps | void;

  getExtra(): any;

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
