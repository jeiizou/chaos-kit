/**
 * @example:
 * let handle = Watcher.visibilityWatcher()
 * onchange event emiter
 * handle.onChange = (pageShow) => { // do somethings }
 * clear handle
 * handle()
 */

export class StateWatcher {
    /**
     * page visibilty state watcher
     */
    static visibilityWatcher() {
        let vEvent = 'visibilitychange';
        if (document.hidden != undefined) {
            vEvent = 'webkitvisibilitychange';
        }
        function visibilityChanged() {
            if (document.hidden) {
                handle.onChange(false);
            } else {
                handle.onChange(true);
            }
        }
        document.addEventListener(vEvent, visibilityChanged, false);
        function handle() {
            document.removeEventListener(vEvent, visibilityChanged, false);
        }
        handle.onChange = function (pageShow: boolean) {};
        return handle;
    }

    /**
     * netWork Watcher
     */
    static netWorkWatcher() {
        let loacl_navigator = window.navigator as any;
        let connection =
            loacl_navigator.connection ||
            loacl_navigator.mozConnection ||
            loacl_navigator.webkitConnection;

        let type = connection.effectiveType;
        function updateConnectionStatus() {
            handle.onChange && handle.onChange(type, connection.effectiveType);
            type = connection.effectiveType;
        }
        function handle() {
            connection.removeEventListener('change', updateConnectionStatus);
        }
        handle.onChange = function (oldVal: string, newVal: string) {};
        connection.addEventListener('change', updateConnectionStatus);
        return handle;
    }

    /**
     * long task watcher
     */
    static longTaskWatcher() {
        const observer = new PerformanceObserver(list => {
            for (const entry of list.getEntries()) {
                handle.onChange && handle.onChange(entry);
            }
        });
        function handle() {
            observer.disconnect();
        }
        handle.onChange = function (entry: PerformanceEntry) {};
        observer.observe({ entryTypes: ['longtask'] });
        return handle;
    }
}
