//@ts-check
const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
jiife.processFiles([xl + 'define.js', xl + 'debounce.js', xl + 'xtal-latx.js', xl + 'createNestedProp.js', 
                    xl + 'with-path.js', xl + 'mergeDeep.js', xl + 'getHost.js',
    'xtal-state-base.js', 'url-formatter.js', 'xtal-state-commit.js', 'xtal-state-update.js', 'xtal-state-watch.js', 'xtal-state-parse.js', ], 'dist/xtal-state.iife.js');



