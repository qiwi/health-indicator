export type IHealthDeps = {
  [key: string]: IHealth;
} | undefined

export interface IHealth {
  status: string,
  critical: boolean,
  deps: IHealthDeps,

  [key: string]: any,
}

export type IHealthOpts = {
  status: string,
  critical?: boolean,
  deps?: IHealthDeps,
  extra?: IHealthExtra,
}

export type IHealthExtra = {
  [key: string]: any
} | undefined
