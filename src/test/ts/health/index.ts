import Health from '../../../main/ts/health'

describe('Health', () => {
  it('constructs proper instance', () => {
    const status = 'Foo'
    const critical = false
    const dep1 = new Health({ status, critical })
    const dep2 = new Health({ status, critical, deps: { dep1 } })
    const deps = { dep1, dep2 }
    const foo = 'bar'
    const baz = 123
    const extra = { foo, baz }

    const health = new Health({ status, critical, deps, extra })

    expect(health).toBeInstanceOf(Health)
    expect(health.status).toEqual(status)
    expect(health.critical).toEqual(critical)
    expect(health.deps).toEqual(deps)
    expect(health.deps?.dep2?.deps?.dep1).toEqual(dep1)
    expect(health.foo).toEqual(foo)
    expect(health.baz).toEqual(baz)
  })
})
