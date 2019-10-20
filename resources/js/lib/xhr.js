import axios from 'axios'

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

// window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * This is a wrapper for AJAX requests
 */
export default class Xhr {
    /**
     * Construct
     */
    constructor() {
        this.requests = [];
    }

    static url(str, params) {
        return '/api/v1/' + str + (params ? '?'+ query(params) : '');
    }

    /**
     * Cancel request
     */
    cancel() {
        for (let request of this.requests) {
            request();
        }
    }

    /**
     * Perform DELETE request
     *
     * @param {*} url
     * @param {*} data
     * @param {*} callback
     */
    delete(url, data, callback) {
        return this.request("delete", url, data, callback);
    }

    /**
     * Perform POST request
     *
     * @param {*} url
     * @param {*} data
     * @param {*} callback
     */
    post(url, data, callback) {
        return this.request("post", url, data, callback);
    }

    /**
     * Perform PUT request
     *
     * @param {*} url
     * @param {*} data
     * @param {*} callback
     */
    put(url, data, callback) {
        return this.request("put", url, data, callback);
    }

    /**
     * Perform GET request
     *
     * @param {*} url
     * @param {*} data
     * @param {*} callback
     */
    get(url, data, callback) {
        if (data) {
            if (typeof data == "function") {
                callback = data;
                data = null;
            } else if (typeof data == "object") {
                data = query(data);
            }
            if (data) {
                url += (url.indexOf("?") === -1 ? "?" : "&") + data;
            }
        }
        return this.request("get", url, null, callback);
    }

    /**
     * Perform request
     *
     * @param {*} type
     * @param {*} url
     * @param {*} data
     * @param {*} callback
     */
    request(type, url, data, callback) {
        if (typeof data === "function") {
            callback = data;
            data = {};
        }

        if (!data) {
            data = {};
        }

        let cancel = null;
        data.cancelToken = new axios.CancelToken(function executor(e) {
            cancel = e;
        });

        let request = axios[type](url, data)
            .then(function(response, reject) {
                if (callback) {
                    callback(response.data);
                }
            })
            .catch((error, response) => {
                if (!axios.isCancel(error)) {
                    console.warn(error);
                }

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if(callback) {
                        return callback(error.response.data);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                if (callback) {
                    callback({ success: false });
                }
            });

        this.requests.push(cancel);

        return {
            promise: request,
            cancel
        };
    }
}

/**
 * Query parameters
 */

let query = function(j, y, x) {
    y = "";
    j = JSON.parse(JSON.stringify(j));
    for (x in j) {
        if (!j.hasOwnProperty(x)) {
            continue;
        }
        if (j[x] === null) continue;
        if (typeof j[x] === "object") {
            for (let a in j[x]) {
                if (!j[x].hasOwnProperty(a)) {
                    continue;
                }
                if (j[x][a] === null) continue;
                y += "&" + x + "[" + a + "]=" + encodeURIComponent(j[x][a]);
            }
        } else y += "&" + x + "=" + encodeURIComponent(j[x]);
    }
    return y.slice(1);
};
