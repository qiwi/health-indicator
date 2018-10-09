import {AbstractIndicator, SemaphoreIndicator, StandardIndicator, Endpoint} from '../dist'
import chai from 'chai'

const {expect} = chai

describe('dist/index', () => {
  it('properly exposes its inners', () => {
    ([AbstractIndicator, SemaphoreIndicator, StandardIndicator, Endpoint]).forEach(item => {
      expect(item).not.to.be.undefined
    })
  })
})
