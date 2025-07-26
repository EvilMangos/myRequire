const path = require('path');
const loadModule = require('./loadModule.js');
const { builtinModules } = require('module');

const myRequire = (moduleName, callerPath) => {
	console.log(`Require invoked for module: ${moduleName} from: ${callerPath || 'initial call'}`);

	if (builtinModules.includes(moduleName)) {
		return require(moduleName);
	}

	if (moduleName in require.cache) {
		return require.cache[moduleName].exports;
	}

	const baseDir = callerPath ? path.dirname(callerPath) : process.cwd();
	const id = myRequire.resolve(moduleName, baseDir);

	console.log(`Resolved path: ${id}`);

	if (myRequire.cache[id]) {
		return myRequire.cache[id].exports;
	}

	const module = {
		exports: {},
		id,
	};

	myRequire.cache[id] = module;

	loadModule(id, module, myRequire);

	return module.exports;
};

myRequire.cache = {};
myRequire.resolve = (moduleName, baseDir) => {
	if (moduleName.startsWith('.')) {
		const resolvedPath = path.resolve(baseDir, moduleName);
		if (!resolvedPath.endsWith('.js')) {
			return resolvedPath + '.js';
		}
		return resolvedPath;
	} else {
		return path.resolve(process.cwd(), moduleName);
	}
};

module.exports = myRequire;