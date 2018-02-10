export default class Schema {
	constructor({severityOrder, defaultStatus, httpMapping={}, defaultHttpCode=200}) {
		this.severityOrder = [...severityOrder];
		this.defaultStatus = defaultStatus;
		this.defaultHttpCode = defaultHttpCode;
		this.httpMapping = httpMapping;
	}
}