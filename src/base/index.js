export {
	extend,
	min,
	minBy,
	maxBy,
	map,
	find,
	filter,
	isUndefined,
	isObject,
	isString,
	isFunction,
	mapValues,
	toArray
} from 'lodash-es';

export function isDefined(value) {
	return value !== undefined;
}