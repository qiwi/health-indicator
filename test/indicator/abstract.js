import chai from 'chai'
import {AbstractIndicator} from '../../src/indicator'

const {expect} = chai

class CustomIndicator extends AbstractIndicator {}

describe('AbstractIndicator', () => {
  it('constructor prevent direct instantiation', () => {
    expect(() => {new AbstractIndicator({})}).to.throw();
  })

  describe('static', () => {
    describe('resolveStatus', () => {

    })
  })

  describe('proto', () => {
    describe('getStatus', () => {
      it('return status property if exists', () => {
        const status = 'foo';
        expect(new CustomIndicator({status}).getStatus()).to.equal(status);
      })

      it.only('resolves value from deps if exists', () => {
        const status = 'bar';
        const deps = {
          dep1: new CustomIndicator({status})
        };
        expect(new CustomIndicator({deps}).getStatus()).to.equal(status);
      })

      it('return default value otherwise', () => {

      })
    })
  })
})
