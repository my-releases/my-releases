let notify = (function() {
    let messages = [];
    let main = {
        notify
    };

    let list = document.createElement("UL");
    list.id = "notifications";

    /**
     * Append to body when it exists.
     */

    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function() {
        document.body.appendChild(list);

        if(messages && messages.length) {
            for(let i in messages) {
                if(!messages.hasOwnProperty(i)) {
                    continue;
                }

                let not = messages[i];

                not.show().hide(6000);
            }

            messages = [];
        }
    });

    return main;

    /**
     * Return a new `Notification` with the given
     * (optional) `title` and `msg`.
     *
     * @param {String} title or msg
     * @param {String} msg
     * @return {Dialog}
     * @api public
     */

    function notify(title, message, type, timer) {
        let not = null;
        timer = timer || 6000;
        if (message) {
            not = new Notifier({ title, message });
        } else {
            not = new Notifier({ message: title });
        }

        if (type) {
            not.type(type);
        }

        if(!document.getElementById('notifications')) {
            messages.push(not);
            return;
        }

        not.show().hide(timer);
    }
})();

/**
 * Initialize a new `Notifier`.
 *
 * Options:
 *
 *    - `title` dialog title
 *    - `message` a message to display
 *
 * @param {Object} options
 * @api public
 */
let NotificationTemplate =
    `<div class="content">
		<span class="title">Title</span>
		<a href="#" class="close">&#215;</a>
		<p>Message</p>
	</div>`;


function Notifier(options) {
    options = options || {};
    this.el = document.createElement("LI");
    this.el.className = "notification closable hide";
    this.el.innerHTML = NotificationTemplate;
    this.effect("scale");
    this.render(options);

    if (options.classname) {
        this.el.addClass(options.classname);
    }

    if (Notifier.effect) {
        this.effect(Notifier.effect);
    }
}

/**
 * Render with the given `options`.
 *
 * @param {Object} options
 * @api public
 */

Notifier.prototype.render = function(options) {
    let el = this.el,
        title = options.title,
        msg = options.message,
        self = this;

    el.querySelector(".close").addEventListener("click", function() {
        // self.emit('close');
        self.hide();
        return false;
    });

    el.addEventListener("click", function(e) {
        e.preventDefault();
        self.hide();
        // self.emit('click', e);
    });

    el.querySelector(".title").innerText = title;
    if (!title) {
        el.querySelector(".title").remove();
    }

    // message
    if ("string" === typeof msg) {
        el.querySelector("p").innerText = msg;
    } else if (msg) {
        el.querySelector("p").innerText = el
            .querySelector("p")
            .innerText.replace(msg.el || msg);
    }

    setTimeout(function() {
        el.className = el.className.replace(" hide", "");
    }, 50);

    return el;
};

/**
 * Enable the dialog close link.
 *
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.closable = function() {
    this.el.addClass("closable");

    return this;
};

/**
 * Set the effect to `type`.
 *
 * @param {String} type
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.effect = function(type) {
    this._effect = type;
    this.el.className = this.el.className + " " + type;

    return this;
};

/**
 * Show the Notifier.
 *
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.show = function() {
    let list = document.getElementById("notifications");
    list.insertBefore(this.el, list.firstChild);

    return this;
};

/**
 * Set the notification `type`.
 *
 * @param {String} type
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.type = function(type) {
    this._type = type;
    this.el.className = this.el.className + " " + type;

    return this;
};

/**
 * Make it stick (clear hide timer), and make it closable.
 *
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.sticky = function() {
    return this.hide(0).closable();
};

/**
 * Hide the dialog with optional delay of `ms`,
 * otherwise the notification is removed immediately.
 *
 * @return {Number} ms
 * @return {Notifier} for chaining
 * @api public
 */

Notifier.prototype.hide = function(ms) {
    let self = this;

    // duration
    if ("number" === typeof ms) {
        clearTimeout(this.timer);
        if (!ms) return this;
        this.timer = setTimeout(function() {
            self.hide();
        }, ms);
        return this;
    }

    // hide / remove
    this.el.className = this.el.className + " hide";
    if (this._effect) {
        setTimeout(
            function(self) {
                self.remove();
            },
            500,
            this
        );
    } else {
        self.remove();
    }

    return this;
};

/**
 * Hide the notification without potential animation.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Notifier.prototype.remove = function() {
    this.el.remove();

    return this;
};

export default notify;
