var toString = Object.prototype.toString;

function isFunc(source) {
    return toString.call(source) === '[object Function]';
}

function isObjecet(arg) {
    return typeof arg === 'object' && arg !== null;  
}

function addListener(type, listener) {
    if (!isFunc)
        throw TypeError("listener must be a function");

    if (!this._events)
        this._events = {};

    if (this._events.newListener) {
        this.emit('newListener', type, isFunc(listener.listener) ?
            listener.listener : listener);
    }

    if(!this._events[type]) 
        this._events[type] = listener;
    else if (isObjecet(this._events[type]))
        this._events[type].push(listener);
}