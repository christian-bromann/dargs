'use strict';
var numberIsNan = require('number-is-nan');

function createArg(key, val, cc) {
	if(cc) {
		key = key.replace(/[A-Z]/g, '-$&').toLowerCase();
	}

	return '--' + key + (val ? '=' + val : '');
}

module.exports = function (input, opts) {
	var args = [];

	opts = opts || {};
	var cc = opts.translateCamelCase;

	Object.keys(input).forEach(function (key) {
		var val = input[key];

		if (Array.isArray(opts.excludes) && opts.excludes.indexOf(key) !== -1) {
			return;
		}

		if (Array.isArray(opts.includes) && opts.includes.indexOf(key) === -1) {
			return;
		}

		if (val === true) {
			args.push(createArg(key, null, cc));
		}

		if (val === false && !opts.ignoreFalse) {
			args.push(createArg('no-' + key, cc));
		}

		if (typeof val === 'string') {
			args.push(createArg(key, val, cc));
		}

		if (typeof val === 'number' && !numberIsNan(val)) {
			args.push(createArg(key, '' + val, cc));
		}

		if (Array.isArray(val)) {
			val.forEach(function (arrVal) {
				args.push(createArg(key, arrVal, cc));
			});
		}
	});

	return args;
};
