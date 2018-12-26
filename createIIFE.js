//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
const api = [xl + 'define.js', xl + 'xtal-latx.js', xl + 'getHost.js', 'xtal-state-api.js'];
jiife.processFiles(api, 'dist/xtal-state-api.js', true);
const common = api.concat(['xtal-state-base.js']);
const watch = ['xtal-state-watch.js'];
jiife.processFiles(common.concat(watch), 'dist/xtal-state-watch.iife.js');
const parse = ['xtal-state-parse.js'];
jiife.processFiles(common.concat(parse), 'dist/xtal-state-parse.iife.js');
const commit = [xl + 'debounce.js', xl + 'createNestedProp.js', xl + 'with-path.js', xl + 'mergeDeep.js', 'url-formatter.js', 'xtal-state-commit.js'];
jiife.processFiles(common.concat(commit), 'dist/xtal-state-commit.iife.js');
const update = ['xtal-state-update.js'];
jiife.processFiles(common.concat(commit).concat(update), 'dist/xtal-state-update.iife.js');
jiife.processFiles(common.concat(watch).concat(parse).concat(commit).concat(update), 'dist/xtal-state.iife.js');




