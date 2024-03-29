import { AbstractIndicator, Endpoint, SemaphoreIndicator, StandardIndicator } from '../../main/ts'

describe('index', () => {
  it('properly exposes its inners', () => {
    ([AbstractIndicator, SemaphoreIndicator, StandardIndicator, Endpoint]).forEach(item => {
      expect(item).not.toBeUndefined()
    })
  })
})
