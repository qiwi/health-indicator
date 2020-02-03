import { AbstractIndicator } from '../../../main/ts/indicator'
import { IIndicatorDeps } from '../../../main/ts/indicator/interface'

class CustomIndicator extends AbstractIndicator {
  static getDefaultStatus () {
    return super.getDefaultStatus()
  }
}

describe('AbstractIndicator', () => {
  it('constructor prevent direct instantiation', () => {
    expect(() => new AbstractIndicator({})).toThrow()
  })

  describe('static', () => {
    it('`getDefaultStatus` returns proper string', () => {
      expect(typeof AbstractIndicator.getDefaultStatus()).toBe('string')
    })

    it('`getDefaultCritical` returns proper bool', () => {
      expect(typeof AbstractIndicator.getDefaultCritical()).toBe('boolean')
    })

    it('`getSeverityOrder` returns status list', () => {
      expect(AbstractIndicator.getSeverityOrder()).toEqual(expect.any(Array))
    })

    it('`getStatusMap` returns status map', () => {
      expect(typeof AbstractIndicator.getStatusMap()).toBe('object')
    })

    it('`getHttpMap` returns http code mapping', () => {
      expect(typeof AbstractIndicator.getHttpMap()).toBe('object')
    })

    it('`getDefaultHttpCode` returns proper code', () => {
      expect(typeof AbstractIndicator.getDefaultHttpCode()).toBe('number')
    })

    it('`getHttpCode` resolves code by status', () => {
      const defaultCode = AbstractIndicator.getDefaultHttpCode()
      const defaultStatus = AbstractIndicator.getDefaultStatus()

      expect(AbstractIndicator.getHttpCode()).toEqual(defaultCode)
      expect(AbstractIndicator.getHttpCode(defaultStatus)).toEqual(defaultCode)
    })

    describe('resolveCriticalFromDeps', () => {
      it('returns true if finds critical dep at any level', () => {
        const critical = true
        const deps = {
          dep1: new CustomIndicator({
            deps: {
              dep2: new CustomIndicator({
                deps: {
                  dep3: new CustomIndicator({ critical })
                }
              })
            }
          })
        }
        expect(AbstractIndicator.resolveCriticalFromDeps(deps, false)).toBe(true)
      })

      it('returns false otherwise', () => {
        expect(AbstractIndicator.resolveCriticalFromDeps({}, false)).toBe(false)
      })
    })

    it('`getLowestStatus` selects the lowest', () => {
      const down = 'DOWN'
      const unknown = 'UNKNOWN'
      const up = 'UP'
      const order = [down, unknown, up]
      const deps = {
        dep1: new CustomIndicator({ status: down }),
        dep2: new CustomIndicator({ status: unknown })
      }

      expect(AbstractIndicator.getLowestStatus(deps, order)).toEqual(down)
      expect(AbstractIndicator.getLowestStatus(deps)).toEqual(unknown) // NOTE default order is ['UNDEFINED']
      expect(AbstractIndicator.getLowestStatus(deps, [unknown, up, down])).toEqual(unknown)
    })

    it('`getHighestStatus` selects the highest', () => {
      const red = 'RED'
      const yellow = 'YELLOW'
      const green = 'GREEN'
      const order = [red, yellow, green]
      const deps = {
        dep1: new CustomIndicator({ status: red }),
        dep2: new CustomIndicator({
          deps: {
            dep3: new CustomIndicator({ status: yellow })
          }
        })
      }

      expect(AbstractIndicator.getHighestStatus(deps, order)).toEqual(yellow)
      expect(AbstractIndicator.getHighestStatus(deps)).toEqual(red)
    })

    describe('resolveStatusFromDeps', () => {
      const red = 'RED'
      const yellow = 'YELLOW'
      const green = 'GREEN'
      const order = [red, yellow, green]

      it('returns the lowest critical', () => {
        const critical = true
        const deps: IIndicatorDeps = {
          dep0: new CustomIndicator({ status: red }),
          dep1: new CustomIndicator({ status: green }),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({ status: yellow, critical })
            }
          }),
          dep4: Object.assign(new CustomIndicator(), {
            health () {
              return {
                status: green,
                critical
              }
            }
          })
        }
        expect(AbstractIndicator.resolveStatusFromDeps(deps, order)).toEqual(yellow)
      })

      it('returns the highest non-critical', () => {
        const deps = {
          dep1: new CustomIndicator({ status: red }),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({ status: green })
            }
          }),
          dep4: new CustomIndicator({
            status: red,
            deps: {
              dep5: new CustomIndicator({ status: yellow })
            }
          })
        }
        expect(AbstractIndicator.resolveStatusFromDeps(deps, order)).toEqual(green)
      })

      it('otherwise returns default if no dep specified', () => {
        expect(AbstractIndicator.resolveStatusFromDeps({}, order, 'foo')).toEqual('foo')
      })
    })
  })

  describe('proto', () => {
    describe('getStatus', () => {
      it('return status property if exists', () => {
        const status = 'foo'
        expect(new CustomIndicator({ status }).getStatus()).toEqual(status)
      })

      it('resolves value from deps if exists', () => {
        const status = 'bar'
        const deps = {
          dep1: new CustomIndicator({ status })
        }
        expect(new CustomIndicator({ deps }).getStatus()).toEqual(status)
      })

      it('return default value otherwise', () => {
        expect(new CustomIndicator({}).getStatus()).toEqual(AbstractIndicator.getDefaultStatus())
      })
    })

    describe('getExtra', () => {
      it('return extra property if exists', () => {
        const extra = { foo: 'bar' }
        expect(new CustomIndicator({ extra }).getExtra()).toEqual(extra)
      })

      it('returns undefined otherwise', () => {
        expect(new CustomIndicator({}).getExtra()).toBeUndefined()
      })
    })

    describe('getCritical', () => {
      it('returns critical property value if exists', () => {
        const critical = true
        expect(new CustomIndicator({ critical }).getCritical()).toEqual(critical)
      })

      it('resolves value from deps if exists', () => {
        const critical = true
        const deps = {
          dep1: new CustomIndicator({ critical })
        }
        expect(new CustomIndicator({ deps }).getCritical()).toEqual(critical)
      })
    })

    describe('getDeps', () => {
      it('returns deps reference if exists', () => {
        const deps = {
          dep1: new CustomIndicator({})
        }
        expect(new CustomIndicator({ deps }).getDeps()).toEqual(deps)
      })

      it('returns undefined otherwise', () => {
        expect(new CustomIndicator({}).getDeps()).toBeUndefined()
      })
    })

    describe('health', () => {
      it('returns aggregated health', () => {
        const deps = {
          dep1: new CustomIndicator({ status: 'FOO' }),
          dep2: new CustomIndicator({
            deps: {
              dep3: new CustomIndicator({ status: 'BAR' })
            }
          }),
          dep4: new CustomIndicator({
            status: 'QUX',
            critical: false,
            deps: {
              dep5: new CustomIndicator({ status: 'BAZ', critical: true, extra: { a: 'A' } })
            }
          })
        }
        const extra = { b: 'B' }
        const indicator = new CustomIndicator({ deps, extra })

        expect(indicator.health()).toMatchObject({
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
