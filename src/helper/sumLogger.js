const myRequire = require('../myRequire.js');

const dependency = myRequire('../dependency.js');

module.exports = {
	logSum: (a, b) => console.log(dependency.sum(a, b)),
};
