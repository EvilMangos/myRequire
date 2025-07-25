const path = require('path');
const { readFileSync } = require('fs');

const loadModule = (filename, module, myRequire) => {
	const moduleBody = readFileSync(filename, 'utf8');
	const moduleFunction = new Function(
		'module',
		'exports',
		'require', // use myRequire instead of require
		'__dirname',
		moduleBody
	);
	moduleFunction(module, module.exports, myRequire, path.dirname(filename));
};

module.exports = loadModule;
