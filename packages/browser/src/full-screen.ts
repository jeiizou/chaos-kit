/**
 * controll dom is fullscreen show
 */
export class FullScreen {
    constructor(
        private dom: Element,
        public onChange: ((this: Element, ev: Event) => any) | null = null,
    ) {
        if (document.fullscreenEnabled) {
            this.eventHandle();
        } else {
            console.error('your browser not support fullscreen api');
            throw Error('your browser not support fullscreen api');
        }
    }

    private isOnFull: Boolean = false;

    public enable() {
        this.dom.requestFullscreen();
        this.isOnFull = true;
    }

    public exit() {
        document.exitFullscreen();
        this.isOnFull = false;
    }

    public getIsOnFull() {
        return this.isOnFull;
    }

    private onError() {
        throw Error('fullscreen error on ' + this.dom);
    }

    private eventHandle() {
        // error event handle
        this.dom.onfullscreenerror = () => {
            this.onError();
        };
        // fullscreen change handle
        this.dom.onfullscreenchange = this.onChange;
    }
}
