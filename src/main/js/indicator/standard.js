// @flow

import AbstractIndicator from './abstract'
import {OK, SERVICE_UNAVAILABLE} from '../endpoint/statuses'
import type {IStatusMap, IHttpMap, IIndicator, IIndicatorStatics} from './interface'

export const UP = 'UP'
export const DOWN = 'DOWN'
export const UNKNOWN = 'UNKNOWN'
export const OUT_OF_SERVICE = 'OUT_OF_SERVICE'
export const STATUS_MAP = {UP, UNKNOWN, DOWN, OUT_OF_SERVICE}
export const SEVERITY_ORDER = [DOWN, OUT_OF_SERVICE, UNKNOWN, UP]

export const HTTP_MAP = {
  [UP]: OK,
  [DOWN]: SERVICE_UNAVAILABLE,
  [OUT_OF_SERVICE]: SERVICE_UNAVAILABLE
}

export default class StandardIndicator extends AbstractIndicator implements IIndicator {
  static getHttpMap (): IHttpMap {
    return HTTP_MAP
  }

  static getStatusMap (): IStatusMap {
    return STATUS_MAP
  }

  static getSeverityOrder (): string[] {
    return SEVERITY_ORDER
  }
}
(StandardIndicator: IIndicatorStatics)
