//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', 'xtal-state-commit.js', 'xtal-state-update.js', 'xtal-state-watch.js'], 'xtal-state.js');


