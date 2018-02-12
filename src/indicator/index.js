import Health from '../health';
import {mapValues, find, filter, isDefined, minBy, toArray} from '../base';

export default class Indicator {
	constructor({schema, sources, critical}) {
		this.schema = schema;
		this.sources = sources;
		this.critical = !!(isDefined(critical) ? critical : schema.defaultCritical);
	}

	health() {
		const details = this.getDetails();
		const status = this.getStatus();
		const critical = this.getCritical();

		return new Health({
			status,
			critical,
			details
		});
	}

	getStatus() {
		if (!this.sources) {
			return this.schema.defaultStatus;
		}
	}

	getCritical() {
		if (!this.sources) {
			return this.critical;
		}
		return this.schema.defaultCritical;
	}

	getDetails() {
		if (!this.sources) {
			return null;
		}
	}

	static resolveCritical(details) {
		return !!find(details, ({critical}) => critical === true);
	}

	static resolveStatus(details, order) {
		const deps = toArray(details);
		const criticalDeps = filter(deps, ({critical}) => critical === true);

		if (criticalDeps.length) {
			return this.getLowestStatus(criticalDeps, order);
		}

		const lowestStatus = this.getLowestStatus(deps, order);


	}

	static resolveDetails(sources) {
		return mapValues(sources, source => {
			if (source instanceof Indicator) {
				return source.health();
			}

			return new Health(source);
		});
	}

	/**
	 *
	 * @param {Health[]} set
	 * @param {string[]} order
	 * @returns {string/null}
	 */
	static getLowestStatus(set, order) {
		if (!set || !set.length) {
			return null;
		}

		return minBy(set, ({status}) => order.indexOf(status)).status;
	}
}