// @flow

import {extend} from '../base'
import type {IHealth, IHealthOpts, IHealthDeps} from './interface'

export default class Health implements IHealth {
  status: string;
  critical: boolean;
  deps: IHealthDeps | void;
  $key: any;
  $value: any;

  constructor ({status, critical, deps, extra}: IHealthOpts) {
    if (extra) {
      extend(this, extra)
    }
    if (deps) {
      this.deps = deps
    }

    this.status = status
    this.critical = !!critical
  }
}
