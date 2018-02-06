const path = require('path');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const pkg = require(path.resolve(__dirname, './package.json'));

const banner =
  '/*!\n' +
  ' * ' + pkg.name + ' v' + pkg.version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' Autohome Inc.\n' +
  ' * Released under the MIT License.\n' +
  ' */';

module.exports = {
  input: path.resolve(__dirname, './lib/index.js'),
  external: ['jquery'],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  output: {
    banner,
    file: path.resolve(__dirname, './dist/carpicker.js'),
    format: 'umd',
    name: 'AutoFE.Carpicker',
    globals: {
      jquery: 'jQuery',
    }
  },
};
