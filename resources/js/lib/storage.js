/**
 * Storage manipulation
 */
let storage = function(key, value, unset, storage) {
    storage = ( storage && storage === 'session' ) ? window.sessionStorage : window.localStorage;

    // unset storage by key
    if( unset ) {
        return storage.removeItem(key);
    }

    if( typeof value === "undefined" ) {
        let data = storage.getItem(key);
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }

    if( typeof value === 'object' ) {
        value = JSON.stringify(value);
    }

    try {
        return storage.setItem(key, value);
    } catch(e) {
        console.error('Your browser does not support storing locally.');
    }

    return null;
};

export default storage;
