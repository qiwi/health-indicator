import chai from 'chai'
import chaiSubset from 'chai-subset'
import {SemaphoreIndicator, AbstractIndicator} from '../../src/indicator'
import {STATUS_MAP, HTTP_MAP, SEVERITY_ORDER, DEFAULT_STATUS} from '../../src/indicator/semaphore'

const {expect} = chai
chai.use(chaiSubset)

describe('SemaphoreIndicator', () => {
  describe('static', () => {
    it('`getDefaultStatus` returns `BROKEN`', () => {
      expect(SemaphoreIndicator.getDefaultStatus()).to.equal(DEFAULT_STATUS)
    })

    it('inherits `getDefaultHttpCode` from AbstractIndicator', () => {
      expect(SemaphoreIndicator.getDefaultHttpCode()).to.equal(AbstractIndicator.getDefaultHttpCode())
    })

    it('`getStatusMap` returns proper map', () => {
      expect(SemaphoreIndicator.getStatusMap()).to.equal(STATUS_MAP)
    })

    it('`getHttpMap` returns proper http mapping', () => {
      expect(SemaphoreIndicator.getHttpMap()).to.equal(HTTP_MAP)
    })

    it('`getSeverityOrder` returns the order', () => {
      expect(SemaphoreIndicator.getSeverityOrder()).to.equal(SEVERITY_ORDER)
    })
  })
})
