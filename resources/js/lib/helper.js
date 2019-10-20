import Storage from './storage';
import Listener from './listener';
import Notify from './notify';
import Event from './event';
import Xhr from "./xhr";

let helper = {};

helper.storage = Storage;
helper.listener = Listener;
helper.notify = Notify;
helper.event = Event;
helper.xhr = new Xhr();

/**
 * Trigger a notification message at the top right corner
 * @param title
 * @param message
 * @param type
 * @param timer
 */
helper.notify = function(title, message, type, timer) {
    // console.log(title, message, type);
    if( title && typeof title === 'object' && typeof title.success !== "undefined" ) {
        message = title.success ? (message || (title.msg || '')) : (title.msg || title.message);
        type = title.success;

        if(title.code === 'validation.failed' && typeof title.data !== 'undefined') {
            let messages = [];
            for(let i in title.data) {
                if(!title.data.hasOwnProperty(i)) {
                    continue;
                }

                messages.push(title.data[i]);
            }

            message = messages.join("\n");
            title = title.message;
        } else if(typeof title.message !== 'undefined' && message !== title.message) {
            title = title.message;
        } else {
            title = null;
        }
    }
    if( typeof type === 'number' || typeof type === "boolean" ) {
        type = type ? 'success' : 'danger';
    }
    if( typeof title === "number" || typeof title === "boolean" ) {
        type = title ? 'success' : 'danger';
        title = null;
    }

    // console.log(title, message, type);
    Notify.notify(title, message, type, timer);
};

/**
 * Append the api endpoint to the given endpoint
 * @param endpoint
 * @param params
 * @returns {string}
 */
helper.api = function(endpoint, params) {
    let url = app.api_endpoint + endpoint;

    if(params) {
        url += '?'+ this.query(params);
    }

    return url;
};

/**
 * Validate the response received from the api
 * @param response
 * @param notify
 * @returns {boolean}
 */
helper.invalid = function(response, notify) {
    if(!response || typeof response !== 'object' || (typeof response.success !== 'undefined' && !response.success)) {
        // console.log('error', response); // TODO notify
        helper.notify(response);
        return true;
    }

    if(notify) {
        helper.notify(response);
    }

    return false;
};

/**
 * Fire event on an element
 * @param element
 * @param name
 */
helper.event = function(element, name) {
    let event; // The custom event that will be created

    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(name, true, true);
    } else {
        event = document.createEventObject();
        event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
        element.dispatchEvent(event);
    } else {
        element.fireEvent('on' + event.eventType, event);
    }
};

/**
 * Reference given data
 *
 * @param data
 * @param name
 * @returns {*}
 */
helper.reference = function(data, name) {
    if(!data) {
        return data;
    }

    let result = {};
    for(let i in data) {
        if(!data.hasOwnProperty(i)) {
            continue;
        }

        result[data[i][name]] = data[i];
    }

    return result;
};

helper.loadJS = function(path, id, cb) {
    if(id && document.getElementById(id)) {
        if(cb && typeof cb === 'function') {
            cb();
        }
        return;
    }

    // Get the first script element on the page
    let ref = window.document.getElementsByTagName( 'script' )[ 0 ];

    // Create a new script element
    let script = window.document.createElement( 'script' );

    // Set the script element `src`
    script.src = path;

    if(cb && typeof cb === 'function') {
        script.onload = function() {
            cb();
        }
    }

    if(id) {
        script.id = id;
    }

    // Inject the script into the DOM
    ref.parentNode.insertBefore( script, ref );
};

helper.groupByString = function(data, field, len = 1, start, sort) {
    // len = len || 1;
    start = start || 0;

    let item = null, chars = null, groups = {};
    let dotNotation = field.indexOf('.') !== -1;
    if( dotNotation ) {
        let parts = field.split('.');
        field = parts[parts.length - 1];
    }

    for (let i = 0; i < data.length; i++) {
        item = data[i];

        if( dotNotation ) {
            for(let k = 0; k < parts.length -1; k++ ) {
                item = item[parts[k]];
            }
        }

        if(
            typeof item === 'undefined' ||
            typeof item[field] === 'undefined'
        ) {
            continue;
        }

        val = item[field];

        if( val ) {
            if( typeof val !== 'string' ) val = '' + val;
            if(len !== null && len >= 0) {
                if( len === 1 ) chars = val.charAt(start);
                else chars = val.substr(start, len);
            } else {
                chars = val;
            }
            chars = chars.toUpperCase();
        }
        else {
            chars = '-';
        }

        groups[ chars ] = groups[ chars ] || [];
        groups[ chars ].push( item );
    }

    // if(typeof sort === 'undefined' || sort) {
    // groups = this.sortObject(groups);
    // }

    return groups;
};

helper.sortObject = function(s) {
    let t = {};
    Object.keys(s).sort().forEach(function(k){t[k]=s[k]});
    return t;
};

helper.sortObjectReverse = function(data) {
    let t = {};
    Object.keys(data).reverse().forEach(function(k){
        t[k] = data[k];
    });

    return t;
};

helper.clone = function(data) {
    return !data ? data : JSON.parse(JSON.stringify(data));
};

helper.copyToClipboard = function(str) {
    const el = document.createElement('textarea');  // Create a <textarea> element
    el.value = str;                                 // Set its value to the string that you want copied
    el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px';                      // Move outside the screen to make it invisible
    document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0        // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0)     // Store selection if found
            : false;                                    // Mark as false to know no selection existed before
    el.select();                                    // Select the <textarea> content
    document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el);                  // Remove the <textarea> element
    if (selected) {                                 // If a selection existed before copying
        document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
        document.getSelection().addRange(selected);   // Restore the original selection
    }

    helper.notify(true, `"${str.substr(0, 30)}" copied to clipboard`);
};

helper.timeout = function(func, time, global) {
    if( typeof global === 'function' ) {
        const tmp = func;
        func = global;
        global = time;
        time = tmp;
    }

    if( typeof time === 'function' ) {
        const tmp = func;
        func = time;
        time = tmp;
    }

    let timer = setTimeout(func, time);
    if( typeof app.timers === 'undefined' || !app.timers ) { app.timers = {}; }

    let type = global ? 'global' : 'page';
    if(typeof app.timers[type] === 'undefined' || !app.timers[type]) {
        app.timers[type] = {
            timeout: [],
            interval: [],
        };
    }

    app.timers[type].timeout.push(timer);

    return timer;
};

helper.focusInput = function(el) {
    let input = el.querySelector('input:not([disabled])');

    if( input && input.offsetParent !== null ) {
        input.focus();
    }
};

export default helper;
