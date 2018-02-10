export const UP = 'UP';
export const DOWN = 'DOWN';
export const UNKNOWN = 'UNKNOWN';
export const OUT_OF_SERVICE = 'OUT_OF_SERVICE';

export const DEFAULT_CRITICAL = false;
export const DEFAULT_STATUS = UNKNOWN;
export const DEFAULT_HTTP_CODE = 200;
export const HTTP_MAPPING = {
	[UP]: 200,
	[DOWN]: 503
};

export const SEVERITY_ORDER = [DOWN, OUT_OF_SERVICE, UNKNOWN, UP];

export default {
	mapping: HTTP_MAPPING,
	order: SEVERITY_ORDER,
	defaultStatus: DEFAULT_STATUS,
	defaultHttpCode: DEFAULT_HTTP_CODE
}