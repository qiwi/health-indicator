import { StandardIndicator, AbstractIndicator } from '../../../main/ts/indicator'
import { STATUS_MAP, HTTP_MAP, SEVERITY_ORDER } from '../../../main/ts/indicator/standard'

describe('StandardIndicator', () => {
  describe('static', () => {
    it('inherits `getDefaultStatus` from AbstractIndicator', () => {
      expect(StandardIndicator.getDefaultStatus()).toEqual(AbstractIndicator.getDefaultStatus())
    })

    it('inherits `getDefaultHttpCode` from AbstractIndicator', () => {
      expect(StandardIndicator.getDefaultHttpCode()).toEqual(AbstractIndicator.getDefaultHttpCode())
    })

    it('`getStatusMap` returns proper map', () => {
      expect(StandardIndicator.getStatusMap()).toEqual(STATUS_MAP)
    })

    it('`getHttpMap` returns proper http mapping', () => {
      expect(StandardIndicator.getHttpMap()).toEqual(HTTP_MAP)
    })

    it('`getSeverityOrder` returns the order', () => {
      expect(StandardIndicator.getSeverityOrder()).toEqual(SEVERITY_ORDER)
    })
  })
})
