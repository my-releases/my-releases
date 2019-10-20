/**
 * https://gist.github.com/envomer/6ab237a78116977611ae3e083141eed3
 */
let event = function() {
    let self = this;
    let debug = false;
    let events = {};
    return {
        fire: function(event, ...args) {
            if(debug) {
                console.info('Event fired', event, data);
            }

            event = events[event];
            if (typeof event === 'undefined') {
                return;
            }

            if(typeof event !== 'function') {
                for(let ev of event) {
                    ev(...args);
                }
                return;
            }

            event(...args);
        },
        on: function(event, callback) { // on listener..delete
            if (typeof events[event] !== 'undefined') {
                return;
            }
            if(debug) {
                console.info('Event listener attached', event);
            }

            events[event] = callback;

            return function() {
                delete events[event];
                if(debug) {
                    console.log('Event listener removed', event);
                }
            }
        },
        addOn: function(event, callback) {
            if(typeof events[event] === 'undefined') {
                events[event] = [];
            }

            if(debug) {
                console.log('Event listener added to', event);
            }

            let index = events[event].push(callback);

            return function() {
                events[event].splice(index - 1, 1);
                if(debug) {
                    console.log('Event removed', event, events, index);
                }
            }
        },

        off: function(event) {
            if (typeof events[event] !== 'undefined') {
                if(debug) {
                    console.info('Event listener removed', event);
                }
                delete events[event];
            }
        },

        getEvents() {
            return events;
        }
    };
}();

export default event;
