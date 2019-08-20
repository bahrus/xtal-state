const xtalStateInfoSym = Symbol('xsis');
export const history_state_update = 'history-state-update';
import { mergeDeep } from 'trans-render/mergeDeep.js';
export function init(win = window) {
    if (win[xtalStateInfoSym])
        return;
    win[xtalStateInfoSym] = {
        startedAsNull: win.history.state === null,
    };
    const originalPushState = win.history.pushState;
    const boundPushState = originalPushState.bind(win.history);
    win.history.pushState = function (newState, title, URL) {
        const oldState = win.history.state;
        boundPushState(newState, title, URL);
        de(oldState, win, title);
    };
    const originalReplaceState = win.history.replaceState;
    const boundReplaceState = originalReplaceState.bind(win.history);
    win.history.replaceState = function (newState, title, URL) {
        const oldState = win.history.state;
        boundReplaceState(newState, title, URL);
        de(oldState, win, title);
    };
}
init();
function de(oldState, win, title) {
    const detail = {
        oldState: oldState,
        newState: win.history.state,
        initVal: false,
        title: title
    };
    const historyInfo = win[xtalStateInfoSym];
    if (!historyInfo.hasStarted) {
        historyInfo.hasStarted = true;
        if (historyInfo.startedAsNull) {
            detail.initVal = true;
        }
    }
    const newEvent = new CustomEvent(history_state_update, {
        detail: detail,
        bubbles: true,
        composed: true,
    });
    win.dispatchEvent(newEvent);
}
export function setState(state, title = '', win = window) {
    doState(state, 'replace', title, null, win);
}
export function pushState(state, title = '', url, win = window) {
    doState(state, 'push', title, url, win);
}
function doState(state, verb, title = '', url = null, win = window) {
    window.requestAnimationFrame(() => {
        let oldState = win.history.state;
        if (oldState === null)
            oldState = {};
        const merged = (typeof (oldState === 'object') && (typeof (state) === 'object')) ? mergeDeep(oldState, state) : state;
        window.requestAnimationFrame(() => {
            win.history[verb + 'State'](merged, title, url === null ? win.location.href : url);
        });
    });
}
