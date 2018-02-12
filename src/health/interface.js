// @flow

export interface IHealth {
  constructor(opts: IHealthOpts): IHealth;

  status: string,
  critical: boolean,
  deps: IHealthDeps | void,

  [key: string]: any,
}

export type IHealthOpts = {
  status: string,
  critical?: boolean,
  deps?: IHealthDeps,
  extra?: IHealthExtra,
}

export type IHealthDeps = {
  [key: string]: IHealth;
}

export type IHealthExtra = {
  [key: string]: any
}
