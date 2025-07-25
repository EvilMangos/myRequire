const path = require('path');
const { readFileSync } = require('fs');

const directoryStack = []; // Stack to track current directories

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

const myRequire = (moduleName) => {
	console.log(`Require invoked for module: ${moduleName}`);

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
