import chai from 'chai'
import chaiSubset from 'chai-subset'
import {StandardIndicator} from '../../src/indicator'

const {expect} = chai
chai.use(chaiSubset)

describe('StandardIndicator', () => {
  describe('static', () => {
    it('inherits `getDefaultStatus` from AbstractIndicator', () => {
      expect(StandardIndicator.getDefaultStatus()).to.equal('UNKNOWN')
    })
  })
})
