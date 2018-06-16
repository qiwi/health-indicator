// @flow

import AbstractIndicator from './abstract'
import {OK, SERVICE_UNAVAILABLE} from '../endpoint/statuses'

export const GREEN = 'GREEN'
export const RED = 'RED'
export const BROKEN = 'BROKEN'
export const STATUS_MAP = {GREEN, BROKEN, RED}
export const SEVERITY_ORDER = [RED, BROKEN, GREEN]

export const DEFAULT_STATUS = BROKEN
export const HTTP_MAP = {
  [GREEN]: OK,
  [RED]: SERVICE_UNAVAILABLE,
  [BROKEN]: SERVICE_UNAVAILABLE
}

export default class SemaphoreIndicator extends AbstractIndicator {
  static getDefaultStatus (): string {
    return DEFAULT_STATUS
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
