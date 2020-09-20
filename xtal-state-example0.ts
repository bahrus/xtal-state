import {XtalStateParse} from './xtal-state-parse.js';
import {XtalStateUpdate} from './xtal-state-update.js';
/**
 * @element xtal-state-parse
 * @event match-found
 * @event match-not-found
 */
export class XtalStateParseExample0 extends XtalStateParse{
    withUrlPattern = '';
    guid = '';
    initHistoryIfNull = false;
    parse = '';
    parseFn = null;
}

/**
 * @element xtal-state-update
 * @event history-changed Fires after this component updates history.
 */
export class XtalStateUpdateExample0 extends XtalStateUpdate{
    make = false;
    rewrite = false;
    stringifyFn = null;
    guid = '';
    url = '';
    urlSearch = '';
    replaceUrlValue = '';
    withPath = '';
}

/**
 * @element xtal-state-watch
 * @event history-changed
 */
export class XtalStateWatchExample0 extends XtalStateUpdate{
    guid = '';
}