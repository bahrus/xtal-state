import { XtalStateCommit} from './xtal-state-commit.js';
import {define} from 'xtal-latx/define.js';
import {mergeDeep} from 'xtal-latx/mergeDeep.js';


export class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }



    
    mergedHistory(){
        const sm = super.mergedHistory();
        if(sm === undefined) return undefined;
        if(this._window.history.state === null) return sm;
        const retObj = Object.assign({}, this._window.history.state);
        return mergeDeep(retObj, this.wrap( this._history));
    }


}
define(XtalStateUpdate);