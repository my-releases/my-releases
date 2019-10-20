/**
 * Get value from object via dot notation
 */
let dot = function(obj, str) {
    if( ! str ) {
        return obj;
    }

    if( typeof str === 'string' && str.indexOf('.') === -1 && typeof obj === 'object' ) {
        return obj[str];
    }

    // loop through all keys
    let keys = str.split('.'), nwObj = obj, i;
    for(i = 0; i < keys.length; i++) {
        if( typeof nwObj === 'undefined' || ! nwObj ) {
            return null;
        }
        nwObj = nwObj[ keys[i] ];
    }

    return nwObj;
};

export default dot;
