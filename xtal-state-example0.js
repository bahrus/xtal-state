import { XtalStateParse } from './xtal-state-parse.js';
import { XtalStateUpdate } from './xtal-state-update.js';
/**
 * @element xtal-state-parse
 * @event match-found
 * @event match-not-found
 */
export class XtalStateParseExample0 extends XtalStateParse {
    constructor() {
        super(...arguments);
        this.withUrlPattern = '';
        this.guid = '';
        this.initHistoryIfNull = false;
        this.parse = '';
        this.parseFn = null;
    }
}
/**
 * @element xtal-state-update
 * @event history-changed Fires after this component updates history.
 */
export class XtalStateUpdateExample0 extends XtalStateUpdate {
    constructor() {
        super(...arguments);
        this.make = false;
        this.rewrite = false;
        this.stringifyFn = null;
        this.guid = '';
        this.url = '';
        this.urlSearch = '';
        this.replaceUrlValue = '';
        this.withPath = '';
    }
}
/**
 * @element xtal-state-watch
 * @event history-changed
 */
export class XtalStateWatchExample0 extends XtalStateUpdate {
    constructor() {
        super(...arguments);
        this.guid = '';
    }
}
