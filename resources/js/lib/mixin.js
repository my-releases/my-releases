/**
 * Data
 */
let data = function() {
    return {
        eventsInternal: []
    }
};


let methods = {};

/**
 * Ago
 * @param value
 * @returns {*}
 */
methods.ago = function(value) {
    return dayjs(value).fromNow();
};

/**
 * Ago
 * @param value
 * @returns {*}
 */
methods.datetime = function(value) {
    return dayjs(value).format('YYYY-MM-DD HH:mm');
};

/**
 * On event
 * @param name
 * @param callback
 */
methods.on = function(name, callback) {
    if(this.eventsInternal) {
        this.eventsInternal.push($event.on(name, callback));
    }
};

/**
 * On event
 * @param name
 * @param callback
 */
methods.addOn = function(name, callback) {
    if(this.eventsInternal) {
        this.eventsInternal.push($event.addOn(name, callback));
    }
};

/**
 * Fire event
 * @param name
 * @param data
 */
methods.fire = function(...args) {
    $event.fire(...args);
};

/**
 * Remove event
 * @param name
 */
methods.off = function(name) {
    if(typeof this.eventsInternal[name] !== 'undefined') {
        this.eventsInternal[name]();
    }
};

/**
 * Before destroy hook
 */
let beforeDestroy = function() {
    // console.log('before destruction', this.name, this.eventsInternal);
    if(this.eventsInternal && this.eventsInternal.length) {
        for(let event of this.eventsInternal) {
            if(typeof event === 'function') {
                event();
            }
        }
    }
};

export default {
    data,
    methods,
    beforeDestroy
}
