'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var __watcherAction = "";

/*
 * Middleware
 */
var watcher = exports.watcher = function watcher(store) {
    return function (next) {
        return function (action) {
            __watcherAction = action.type;
            var result = next(action);
            return result;
        };
    };
};

/**
 * @param {object} component - A React stateful/class-based component
 * @param {array} actionsAndCallbacksArray - An array of objects each of which has two properties action and callback where action is the string notation of the action itself and callback is the function that will execute as soon as an update to the component occurs due to the specified action.
 *
 */
var subscribeToWatcher = exports.subscribeToWatcher = function subscribeToWatcher(component, actionsAndCallbacksArray) {
    try {
        component.originalComponentDidUpdate = component.componentDidUpdate;
        component.componentDidUpdate = function (prevProps, prevState) {
            if (component.originalComponentDidUpdate) {
                component.originalComponentDidUpdate(prevProps, prevState);
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = actionsAndCallbacksArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var action = _step.value;

                    if (action.action === __watcherAction) {
                        if (typeof action.callback === 'function') {
                            action.callback();
                        } else {
                            throw new TypeError(action.callback + ' is not a function');
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };
    } catch (e) {
        console.log(e);
    }
};
