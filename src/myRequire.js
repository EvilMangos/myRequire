const path = require('path');
const loadModule = require('./loadModule.js');
const { builtinModules } = require('module');

const directoryStack = []; // Stack to track current directories

const myRequire = (moduleName) => {
	console.log(`Require invoked for module: ${moduleName}`);

	if (builtinModules.includes(moduleName)) {
		return require(moduleName);
	}

	if (moduleName in require.cache) {
		return require.cache[moduleName].exports;
	}

	const baseDir =
		directoryStack.length > 0
			? directoryStack[directoryStack.length - 1]
			: __dirname;
	const id = myRequire.resolve(moduleName, baseDir);

	if (myRequire.cache[id]) {
		return myRequire.cache[id].exports;
	}

	const module = {
		exports: {},
		id,
	};

	myRequire.cache[id] = module;

	// Push the current module's directory to the stack
	directoryStack.push(path.dirname(id));

	// Load the module and allow nested requires to use this directory
	loadModule(id, module, myRequire);

	// Pop the directory after loading is complete
	directoryStack.pop();

	return module.exports;
};

myRequire.cache = {};
myRequire.resolve = (moduleName, baseDir) => {
	if (moduleName.startsWith('.')) {
		return path.resolve(baseDir, moduleName);
	} else {
		return path.resolve(__dirname, moduleName);
	}
};

module.exports = myRequire;
