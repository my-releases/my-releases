let listeners = (function() {
    let i = 1;
    let listeners = {};

    return {
        on(element, event, handler, capture) {
            // console.log('adding listener', element, event, handler, capture);
            element.addEventListener(event, handler, capture);
            listeners[i] = {
                element, event, handler, capture
            };

            let id = i++;
            return {
                id,
                off() {
                    $listeners.off(id)
                }
            };
        },

        off(id) {
            if(id in listeners) {
                let listener = listeners[id];
                listener.element.removeEventListener(listener.event, listener.handler, listener.capture);
                delete listeners[id];
            } else {
                console.warn('app.$listener ID not found', {id});
            }
        }
    }
})();

export default listeners;
