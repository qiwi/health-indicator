import Health from '../health';
import {mapValues, find, isDefined, min} from '../base';

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
		// return min(...)
	}

	static resolveDetails(sources) {
		return mapValues(sources, source => {
			if (source instanceof Indicator) {
				return source.health();
			}

			return new Health(source);
		});
	}
}