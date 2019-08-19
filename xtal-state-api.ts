import {getHost} from 'xtal-element/getHost.js';
import {init} from './xtal-state-base-api.js';

/**
 * 
 * @param par Parent or document fragment which should mantain regional state
 * @param _t XtalStateBase element
 */
function  getIFrmWin(par: HTMLElement | DocumentFragment, callBack?: (ifrm: HTMLIFrameElement) => void) : Window{
    let ifr = par.querySelector('iframe[xtal-state]') as HTMLIFrameElement;
    if(ifr === null){
        ifr = document.createElement('iframe');
        //ifr.src = 'about:blank';
        ifr.setAttribute('xtal-state', '');
        ifr.addEventListener('load', () =>{
            ifr.setAttribute('loaded', '');
            if(callBack !== null) callBack(ifr);
        })
        ifr.src = 'blank.html';
        ifr.style.display = 'none';
        par.appendChild(ifr);
    }else{
        if(!ifr.hasAttribute('loaded')){
            ifr.addEventListener('load', () =>{
                if(callBack !== null) callBack(ifr);
            })
        }else{
            if(callBack !== null) callBack(ifr);
        }
    }
    return ifr.contentWindow;
}

function getMchPar(el: HTMLElement, level: string){
    let test = el.parentElement;
    while(test){
        if(test.matches(level)) return test;
        test = test.parentElement;
    }
}
function getSC(el: HTMLElement){
    const test = getHost(el);
    return test.shadowRoot === null ? test : test.shadowRoot;
}
// export function getWinCtx(el: HTMLElement, level: string){
//     const _t = this;
//     return new Promise((resolve, reject) => {
//         switch(level){
//             case "global":
//                 init(self);
//                 resolve(self);
//                 break;
//             case "local":
//                 getIFrmWin(el.parentElement, ifrm => {
//                     init(ifrm.contentWindow);
//                     resolve(ifrm.contentWindow);
//                 });
//                 break;
//             case "shadow":
//                 getIFrmWin(getSC(el), ifrm => {
//                     init(ifrm.contentWindow);
//                     resolve(ifrm.contentWindow)
//                 });
//                 break;
//             default:
//                 getIFrmWin(getMchPar(el, level), ifrm => {
//                     init(ifrm.contentWindow);
//                     resolve(ifrm.contentWindow)
//                 } );
//         }
//     });
// }



