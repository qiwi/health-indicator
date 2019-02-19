import chai from 'chai'
import chaiSubset from 'chai-subset'
import {StandardIndicator, AbstractIndicator} from '../../main/indicator'
import {STATUS_MAP, HTTP_MAP, SEVERITY_ORDER} from '../../main/indicator/standard'

const {expect} = chai
chai.use(chaiSubset)

describe('StandardIndicator', () => {
  describe('static', () => {
    it('inherits `getDefaultStatus` from AbstractIndicator', () => {
      expect(StandardIndicator.getDefaultStatus()).to.equal(AbstractIndicator.getDefaultStatus())
    })

    it('inherits `getDefaultHttpCode` from AbstractIndicator', () => {
      expect(StandardIndicator.getDefaultHttpCode()).to.equal(AbstractIndicator.getDefaultHttpCode())
    })

    it('`getStatusMap` returns proper map', () => {
      expect(StandardIndicator.getStatusMap()).to.equal(STATUS_MAP)
    })

    it('`getHttpMap` returns proper http mapping', () => {
      expect(StandardIndicator.getHttpMap()).to.equal(HTTP_MAP)
    })

    it('`getSeverityOrder` returns the order', () => {
      expect(StandardIndicator.getSeverityOrder()).to.equal(SEVERITY_ORDER)
    })
  })
})
