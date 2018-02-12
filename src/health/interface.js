// @flow

export interface IHealth {
  constructor(opts: IHealthOpts): IHealth;
  status: string;
  critical: boolean;
  deps?: IHealthDeps;
  [key: string]: any;
}

export type IHealthOpts = {
  status: string;
  critical: boolean;
}

export type IHealthDeps = {
  [key: string]: IHealth;
}

