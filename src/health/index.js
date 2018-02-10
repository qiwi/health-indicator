export default class Health {
	constructor({status, critical, details}) {
		this.status = status;
		this.critical = !!critical;

		if (details) {
			this.details = details;
		}
	}
}