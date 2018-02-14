// @flow

export interface IHealth {
  constructor(opts: IHealthOpts): IHealth;

  status: string,
  critical: boolean,
  deps: IHealthDeps,

  [key: string]: any,
}

export type IHealthOpts = {
  status: string,
  critical?: boolean,
  deps: ?IHealthDeps,
  extra: ?IHealthExtra,
}

export type IHealthDeps = {
  [key: string]: IHealth;
} | void

export type IHealthExtra = {
  [key: string]: any
} | void
