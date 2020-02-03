import { extend } from '../base'
import { IHealth, IHealthOpts, IHealthDeps } from './interface'

export default class Health implements IHealth {
  status: string
  critical: boolean
  deps: IHealthDeps
  [key: string]: any

  constructor ({ status, critical, deps, extra }: IHealthOpts) {
    if (extra) {
      extend(this, extra)
    }
    if (deps) {
      this.deps = deps
    }

    this.status = status
    this.critical = !!critical

    return this
  }
}
