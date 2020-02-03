import reqresnext from 'reqresnext'
import Endpoint from '../../../main/ts/endpoint'
import { SemaphoreIndicator } from '../../../main/ts/indicator'

describe('Endpoint', () => {
  const indicator = new SemaphoreIndicator()
  describe('constructor', () => {
    it('requires indicator instance as param', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(() => new Endpoint()).toThrow()
    })

    it('constructs proper instance', () => {
      const endpoint = new Endpoint(indicator)

      expect(endpoint).toBeInstanceOf(Endpoint)
    })
  })

  describe('proto', () => {
    describe('middleware', () => {
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

      it('returns error if health() throws exception', () => {
        const indicator = new SemaphoreIndicator()
        const endpoint = new Endpoint(indicator)
        const { req, res, next } = reqresnext()

        indicator.health = () => {
          throw new Error('Foo')
        }

        endpoint.middleware(req, res, next)
        expect(res.statusCode).toEqual(500)
        expect(res.body).toEqual(JSON.stringify({ error: 'Health check obtain failed' }))
      })
    })
  })
})
