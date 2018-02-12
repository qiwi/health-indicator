import path from 'path'
import glob from 'glob'

const libDir = 'src';
const files = glob.sync('health/*.js', {
	cwd: path.resolve(libDir),
	ignore: [
		"*/interface.js"
	]
});

files.forEach(f => require(path.resolve(libDir, f)));
