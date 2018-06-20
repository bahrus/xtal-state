import { XtalStateCommit, IHistoryUpdatePacket } from './xtal-state-commit.js';

const wherePath = 'where-path';;
export class XtalStateUpdate extends XtalStateCommit {
    static get is() { return 'xtal-state-update'; }
    static _lastPath: string
    _wherePath: string;
    get wherePath() { return this._wherePath; }
    set wherePath(val) {
        this.setAttribute(wherePath, val);
    }

    static get observedAttributes() {
        return super.observedAttributes.concat([wherePath]);
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string) {
        switch (name) {
            case wherePath:
                this._wherePath = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }

    namespaceHistory(history: any) {
        if (!this._wherePath) return history;
        const returnObj = {};
        let currPath = returnObj;
        const tokens = this._wherePath.split('.');
        const len = tokens.length - 1;
        let count = 0;
        tokens.forEach(path => {
            currPath[path] = count === len ? this._namespacedHistoryUpdate : {};
            currPath = currPath[path];
            count++;
        });
        return returnObj;
    }

    mergeDeep(target, source) {
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
    preProcess(stateUpdate: IHistoryUpdatePacket) {
        stateUpdate.wherePath = this._wherePath;
        XtalStateUpdate._lastPath = this._wherePath;
        this.de('pre-history-merge', {
            value: stateUpdate
        });
        if (!stateUpdate.completed) {
            if (stateUpdate.customUpdater) {
                stateUpdate.completed = true;
                const update = stateUpdate.customUpdater(stateUpdate);
                if (update.proposedState['then'] && typeof (update.proposedState['then'] === 'function')) {
                    update['then'](newDetail => {
                        this.updateHistory(newDetail);
                    })
                    return;
                }
            }else{
                let newState = window.history.state ? Object.assign({}, window.history.state) : {};
                this.mergeDeep(newState, this._namespacedHistoryUpdate);
            }
        }

    }
    


}
if (!customElements.get(XtalStateCommit.is)) {
    customElements.define(XtalStateCommit.is, XtalStateCommit);
}