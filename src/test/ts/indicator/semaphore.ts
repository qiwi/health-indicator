import { SemaphoreIndicator, AbstractIndicator } from '../../../main/ts/indicator'
import { STATUS_MAP, HTTP_MAP, SEVERITY_ORDER, DEFAULT_STATUS } from '../../../main/ts/indicator/semaphore'

describe('SemaphoreIndicator', () => {
  describe('static', () => {
    it('`getDefaultStatus` returns `BROKEN`', () => {
      expect(SemaphoreIndicator.getDefaultStatus()).toEqual(DEFAULT_STATUS)
    })

    it('inherits `getDefaultHttpCode` from AbstractIndicator', () => {
      expect(SemaphoreIndicator.getDefaultHttpCode()).toEqual(AbstractIndicator.getDefaultHttpCode())
    })

    it('`getStatusMap` returns proper map', () => {
      expect(SemaphoreIndicator.getStatusMap()).toEqual(STATUS_MAP)
    })

    it('`getHttpMap` returns proper http mapping', () => {
      expect(SemaphoreIndicator.getHttpMap()).toEqual(HTTP_MAP)
    })

    it('`getSeverityOrder` returns the order', () => {
      expect(SemaphoreIndicator.getSeverityOrder()).toEqual(SEVERITY_ORDER)
    })
  })
})
