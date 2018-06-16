import chai from 'chai'
import spies from 'chai-spies'
import reqresnext from 'reqresnext'
import Endpoint from '../../src/endpoint'
import {SemaphoreIndicator} from '../../src/indicator'

chai.use(spies)

const {expect} = chai
const indicator = new SemaphoreIndicator()

describe('Endpoint', () => {
  describe('constructor', () => {
    it('requires indicator instance as param', () => {
      expect(() => new Endpoint()).to.throw()
    })

    it('constructs proper instance', () => {
      const endpoint = new Endpoint(indicator)

      expect(endpoint).to.be.instanceof(Endpoint)
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
        const {req, res, next} = reqresnext()

        endpoint.middleware(req, res, next)
        expect(res.statusCode).to.equal(httpCode)
        expect(res.body).to.equal(JSON.stringify(health))
      })

      it('returns error if health() throws exception', () => {
        const indicator = new SemaphoreIndicator()
        const endpoint = new Endpoint(indicator)
        const {req, res, next} = reqresnext()

        indicator.health = () => {
          throw new Error('Foo')
        }

        endpoint.middleware(req, res, next)
        expect(res.statusCode).to.equal(500)
        expect(res.body).to.equal(JSON.stringify({error: 'Health check obtain failed'}))
      })
    })
  })
})
