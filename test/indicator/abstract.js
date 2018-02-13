import chai from 'chai'
import chaiSubset from 'chai-subset'
import {AbstractIndicator} from '../../src/indicator'

const {expect} = chai
chai.use(chaiSubset)

class CustomIndicator extends AbstractIndicator {
  static getDefaultStatus () {
    return super.getDefaultStatus()
  }
}

describe('AbstractIndicator', () => {
  it('constructor prevent direct instantiation', () => {
    expect(() => new AbstractIndicator({})).to.throw()
  })

  describe('static', () => {
    it('`getDefaultStatus` returns proper string', () => {
      expect(AbstractIndicator.getDefaultStatus()).to.be.a('string')
    })

    it('`getSeverityOrder` returns status list', () => {
      expect(AbstractIndicator.getSeverityOrder()).to.be.an('array')
    })

    it('`getStatusMap` returns status map', () => {
      expect(AbstractIndicator.getStatusMap()).to.be.an('object')
    })

    it('`getHttpMap` returns http code mapping', () => {
      expect(AbstractIndicator.getHttpMap()).to.be.an('object')
    })

    it('`getDefaultHttpCode` returns proper code', () => {
      expect(AbstractIndicator.getDefaultHttpCode()).to.be.a('number')
    })

    it('`getHttpCode` resolves code by status', () => {
      const defaultCode = AbstractIndicator.getDefaultHttpCode()
      const defaultStatus = AbstractIndicator.getDefaultStatus()

      expect(AbstractIndicator.getHttpCode()).to.equal(defaultCode)
      expect(AbstractIndicator.getHttpCode(defaultStatus)).to.equal(defaultCode)
    })

    describe('resolveCritical', () => {
      it('returns true if finds critical dep at any level', () => {
        const critical = true
        const deps = {
          dep1: new CustomIndicator({
            deps: {
              dep2: new CustomIndicator({
                deps: {
                  dep3: new CustomIndicator({critical})
                }
              })
            }
          })
        }
        expect(AbstractIndicator.resolveCritical(deps)).to.be.true
      })

      it('returns false otherwise', () => {
        expect(AbstractIndicator.resolveCritical()).to.be.false
      })
    })

    it('`getLowestStatus` selects the lowest', () => {
      const down = 'DOWN'
      const unknown = 'UNKNOWN'
      const up = 'UP'
      const order = [down, unknown, up]
      const deps = {
        dep1: new CustomIndicator({status: down}),
        dep2: new CustomIndicator({status: unknown})
      }

      expect(AbstractIndicator.getLowestStatus(deps, order)).to.equal(down)
      expect(AbstractIndicator.getLowestStatus(deps)).to.equal(down)
    })

    it('`getHighestStatus` selects the highest', () => {
      const red = 'RED'
      const yellow = 'YELLOW'
      const green = 'GREEN'
      const order = [red, yellow, green]
      const deps = {
        dep1: new CustomIndicator({status: red}),
        dep2: new CustomIndicator({
          deps: {
            dep3: new CustomIndicator({status: yellow})
          }
        })
      }

      expect(AbstractIndicator.getHighestStatus(deps, order)).to.equal(yellow)
      expect(AbstractIndicator.getHighestStatus(deps)).to.equal(red)
    })

    describe('resolveStatus', () => {
      const red = 'RED'
      const yellow = 'YELLOW'
      const green = 'GREEN'
      const order = [red, yellow, green]

      it('returns the lowest critical', () => {
        const critical = true
        const deps = {
          dep0: new CustomIndicator({status: red}),
          dep1: new CustomIndicator({status: green}),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({status: yellow, critical})
            }
          })
        }
        expect(AbstractIndicator.resolveStatus(deps, order)).to.equal(yellow)
      })

      it('returns the highest non-critical', () => {
        const deps = {
          dep1: new CustomIndicator({status: red}),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({status: green})
            }
          }),
          dep4: new CustomIndicator({
            status: red,
            deps: {
              dep5: new CustomIndicator({status: yellow})
            }
          })
        }
        expect(AbstractIndicator.resolveStatus(deps, order)).to.equal(green)
      })

      it('otherwise returns default if no dep specified', () => {
        expect(AbstractIndicator.resolveStatus({}, order, 'foo')).to.equal('foo')
      })
    })
  })

  describe('proto', () => {
    describe('getStatus', () => {
      it('return status property if exists', () => {
        const status = 'foo'
        expect(new CustomIndicator({status}).getStatus()).to.equal(status)
      })

      it('resolves value from deps if exists', () => {
        const status = 'bar'
        const deps = {
          dep1: new CustomIndicator({status})
        }
        expect(new CustomIndicator({deps}).getStatus()).to.equal(status)
      })

      it('return default value otherwise', () => {
        expect(new CustomIndicator({}).getStatus()).to.equal(AbstractIndicator.getDefaultStatus())
      })
    })

    describe('getExtra', () => {
      it('return extra property if exists', () => {
        const extra = {foo: 'bar'}
        expect(new CustomIndicator({extra}).getExtra()).to.equal(extra)
      })

      it('returns undefined otherwise', () => {
        expect(new CustomIndicator({}).getExtra()).to.be.undefined
      })
    })

    describe('getCritical', () => {
      it('returns critical property value if exists', () => {
        const critical = true
        expect(new CustomIndicator({critical}).getCritical()).to.equal(critical)
      })

      it('resolves value from deps if exists', () => {
        const critical = true
        const deps = {
          dep1: new CustomIndicator({critical})
        }
        expect(new CustomIndicator({deps}).getCritical()).to.equal(critical)
      })
    })

    describe('getDeps', () => {
      it('returns deps reference if exists', () => {
        const deps = {
          dep1: new CustomIndicator({})
        }
        expect(new CustomIndicator({deps}).getDeps()).to.equal(deps)
      })

      it('returns undefined otherwise', () => {
        expect(new CustomIndicator({}).getDeps()).to.be.undefined
      })
    })

    describe('health', () => {
      it('returns aggregated health', () => {
        const deps = {
          dep1: new CustomIndicator({status: 'FOO'}),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({status: 'BAR'})
            }
          }),
          dep4: new CustomIndicator({
            status: 'QUX',
            critical: false,
            deps: {
              dep5: new CustomIndicator({status: 'BAZ', critical: true, extra: {a: 'A'}})
            }
          })
        }
        const extra = {b: 'B'}
        const indicator = new CustomIndicator({deps, extra})

        expect(indicator.health()).to.containSubset({
          status: 'FOO',
          critical: false,
          b: 'B',
          deps: {
            dep1: {
              deps: {},
              status: 'FOO',
              critical: false
            },
            dep2: {
              deps: {
                dep3: {
                  deps: {},
                  status: 'BAR',
                  critical: false
                }
              },
              status: 'BAR',
              critical: false
            },
            dep4: {
              deps: {
                dep5: {
                  a: 'A',
                  deps: {},
                  status: 'BAZ',
                  critical: true
                }
              },
              status: 'QUX',
              critical: false
            }
          }
        })
      })
    })
  })
})
