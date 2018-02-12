// @flow

import type {IHealth, IHealthOpts} from './interface'

export default class Health implements IHealth {
  status: string;
  critical: boolean;
  $key: any;
  $value: any;

  constructor ({status, critical}: IHealthOpts) {
    this.status = status
    this.critical = !!critical
  }
}
