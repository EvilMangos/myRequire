const path = require('path');
const { readFileSync } = require('fs');

const loadModule = (filename, module, myRequire) => {
	const moduleBody = readFileSync(filename, 'utf8');

	const requireWrapper = (moduleName) => {
		return myRequire(moduleName, filename);
	};

	const moduleFunction = new Function(
		'module',
		'exports',
		'require',
		'__dirname',
		'__filename',
		moduleBody
	);

	moduleFunction(
		module,
		module.exports,
		requireWrapper,
		path.dirname(filename),
		filename
	);
};

module.exports = loadModule;