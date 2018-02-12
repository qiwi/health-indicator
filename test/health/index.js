import chai from 'chai';
import Health from '../../src/health';

const { expect } = chai;

describe('health', () => {
	it('constructs proper instance', () => {
		const status = 'Foo';
		const critical = false;

		const health = new Health({status, critical});

		expect(health).to.be.an.instanceof(Health);
		expect(health.status).to.equal(status);
		expect(health.critical).to.equal(critical);
	});
});