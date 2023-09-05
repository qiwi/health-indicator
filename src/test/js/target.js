import reqresnext from 'reqresnext'
import { Endpoint, SemaphoreIndicator } from '../../../target/cjs/index.cjs'

describe('target', () => {
  describe('Endpoint', () => {
    it('returns indicator health data as response', () => {
      const indicator = new SemaphoreIndicator()
      const endpoint = new Endpoint(indicator)
      const health = indicator.health()
      const status = health.status
      const httpCode = SemaphoreIndicator.getHttpCode(status)
      const { req, res, next } = reqresnext()

      endpoint.middleware(req, res, next)
      expect(res.statusCode).toEqual(httpCode)
      expect(res.body).toEqual(JSON.stringify(health))
    })
  })

  describe('Semaphore', () => {
    it('resolves its status from deps', () => {
      const indicator1 = new SemaphoreIndicator()
      const indicator2 = new SemaphoreIndicator()
      const indicator = new SemaphoreIndicator({
        deps: {
          i1: indicator1,
          i2: indicator2
        }
      })

      indicator1.status = 'RED'
      indicator2.status = 'YELLOW'

      expect(indicator.getStatus()).toEqual('RED')
    })
  })
})
