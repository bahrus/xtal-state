import { XtalStateCommit} from './xtal-state-commit.js';
import {define} from 'xtal-latx/define.js';

export class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }


    mergeDeep(target : any, source: any) {
        if (typeof target !== 'object') return;
        if (typeof source !== 'object') return;
        for (const key in source) {
            const sourceVal = source[key];
            const targetVal = target[key];
            if (!sourceVal) continue; //TODO:  null out property?
            if (!targetVal) {
                target[key] = sourceVal;
                continue;
            }

            switch (typeof sourceVal) {
                case 'object':
                    switch (typeof targetVal) {
                        case 'object':
                            this.mergeDeep(targetVal, sourceVal);
                            break;
                        default:
                            //console.log(key);
                            target[key] = sourceVal;
                            break;
                    }
                    break;
                default:
                    target[key] = sourceVal;
            }
        }
        return target;
    }
    
    mergedHistory(){
        if(this._window.history.state === null) return this._history;
        const retObj = Object.assign({}, this._window.history.state);
        return this.mergeDeep(retObj, this._history);
    }
}
define(XtalStateUpdate);