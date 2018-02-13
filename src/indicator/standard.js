// @flow

import AbstractIndicator from './abstract'

// TODO move to endpoint
const OK = 200
const SERVICE_UNAVAILABLE = 503

export const UP = 'UP'
export const DOWN = 'DOWN'
export const UNKNOWN = 'UNKNOWN'
export const OUT_OF_SERVICE = 'OUT_OF_SERVICE'
export const STATUS_MAP = {UP, UNKNOWN, DOWN, OUT_OF_SERVICE}
export const SEVERITY_ORDER = [DOWN, OUT_OF_SERVICE, UNKNOWN, UP]

export const DEFAULT_HTTP_CODE = OK
export const HTTP_MAP = {[UP]: OK, [DOWN]: SERVICE_UNAVAILABLE, [OUT_OF_SERVICE]: SERVICE_UNAVAILABLE}

export default class StandardIndicator extends AbstractIndicator {
  static getDefaultStatus (): string {
    return UNKNOWN
  }

  static getDefaultHttpCode (): number {
    return DEFAULT_HTTP_CODE
  }

  static getHttpMap (): Object {
    return HTTP_MAP
  }

  static getStatusMap (): Object {
    return STATUS_MAP
  }

  static getSeverityOrder (): string[] {
    return SEVERITY_ORDER
  }
}
