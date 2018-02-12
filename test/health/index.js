import chai from 'chai'
import Health from '../../src/health'

const {expect} = chai

describe('health', () => {
  it('constructs proper instance', () => {
    const status = 'Foo'
    const critical = false
    const dep1 = new Health({status, critical})
    const dep2 = new Health({status, critical, deps: {dep1}})
    const deps = {dep1, dep2}
    const foo = 'bar'
    const baz = 123
    const extra = {foo, baz}

    const health = new Health({status, critical, deps, extra})

    expect(health).to.be.an.instanceof(Health)
    expect(health.status).to.equal(status)
    expect(health.critical).to.equal(critical)
    expect(health.deps).to.equal(deps)
    expect(health.deps.dep2.deps.dep1).to.equal(dep1)
    expect(health.foo).to.equal(foo)
    expect(health.baz).to.equal(baz)
  })
})
