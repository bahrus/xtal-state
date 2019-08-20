
const subscriber_count = Symbol('sc');
export class StoreKeeper{
    //subscriberCount = 0;
    ifr: HTMLIFrameElement;
    constructor(public guid: string){
        if(!self[guid]){
            const ifr = document.createElement('iframe');
            ifr[subscriber_count] = 1;
            ifr.id = guid;
            ifr.addEventListener('load', () =>{
                ifr.setAttribute('loaded', '');
            })
            ifr.src = 'blank.html';
            ifr.style.display = 'none';
            document.head.appendChild(ifr); 
            this.ifr = ifr;           
        }else{
            this.ifr = self[guid];
            this.ifr[subscriber_count]++;
        }
    }
    getContextWindow(){
        return new Promise(
            (resolve: (val: Window) => void, reject)=>{
                this.waitForLoad(resolve);
            }
        );
    }

    forget(){
        this.ifr[subscriber_count]--;
        if(this.ifr[subscriber_count] <= 0){
            this.ifr.remove();
        }
    }

    waitForLoad(resolve: (val: Window) => void){
        if(!this.ifr.hasAttribute('loaded') || !this.ifr.contentWindow){
            setTimeout(() =>{
                this.waitForLoad(resolve)
            }, 50);
            return;
        }
        resolve(this.ifr.contentWindow);
    }
}

