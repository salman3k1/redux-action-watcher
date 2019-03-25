import { Component as ReactComponent } from 'react';
import ReduxActionWatcherInternalState from './ReduxActionWatcherInternalState';
const __reduxActionWatcherInternalState = new ReduxActionWatcherInternalState();

/**
 * @param {object} component - A React stateful/class-based component
 * @param {array} actionsAndCallbacksArray - An array of objects each of which has three properties action,callback and onStateChange, where action is the string notation of the action itself and callback is the function that will execute when the action is fired and the state change is complete. The third property onStateChange is optional and will be set to true by default. If the callback is required to be executed regardless of if there was an update in state, you can pass a boolean false as its value.
 *
 */
const subscribeToWatcher = (component, actionsAndCallbacksArray) => {
    try {
        //Check if component is a valid class based ReactComponent
        // if(!(component instanceof  ReactComponent)){
        //     throw new TypeError(component + "is not a valid React class based component");
        // }
        if (typeof component !== "object") {
            throw new TypeError(component + "is not a valid React class based component");
        }

        // Perform type check for actionsAndCallbacksArray
        if (!Array.isArray(actionsAndCallbacksArray)) {
            throw new TypeError(actionsAndCallbacksArray + "is not a valid array of action and callback objects");
        }

        for (let action of actionsAndCallbacksArray) {
            // Prform type checks for each object received
            if (typeof action !== "object") {
                throw new TypeError(action + "is not a valid action and callback object");
            }
            if (!action.hasOwnProperty("action") || !action.hasOwnProperty("callback")) {
                throw new TypeError(action + "is not a valid action and callback object");
            }
            if (action.hasOwnProperty("onStateChange") && typeof action.onStateChange !== "boolean") {
                throw new TypeError(action.onStateChange + "is not a valid onStateChange boolean value");
            }
            let actionOnStateChange = true;
            if (action.onStateChange !== undefined) {
                actionOnStateChange = action.onStateChange;
            }

            const actionName = action.action;
            const actionCallback = action.callback;
            if (typeof actionName !== "string") {
                throw new TypeError(actionName + "is not a String. action property must be a valid action string");
            }

            if (typeof actionCallback !== 'function') {
                throw new TypeError(action.callback + ' is not a function');
            }

            // Proceed with setting reduxActionWatcherSubscriptions property on the component

            if (component.reduxActionWatcherSubscriptions === undefined) {
                component.reduxActionWatcherSubscriptions = {};
            }
            component.reduxActionWatcherSubscriptions[actionName] = { callback: actionCallback, onStateChange: actionOnStateChange };

            //Proceed with adding the subscription to ReduxActionWatcherInternalState

            if (__reduxActionWatcherInternalState.actionSubscriptions[actionName] === undefined) {
                __reduxActionWatcherInternalState.actionSubscriptions[actionName] = [];
            }
            __reduxActionWatcherInternalState.actionSubscriptions[actionName].push(component);
        }

        component.processWatcherSubscription = (actionInProcess) => {
            if (component.reduxActionWatcherSubscriptions[actionInProcess] !== undefined) {
                component.reduxActionWatcherSubscriptions[actionInProcess].callback();
            }
        }

        // Auto unsubscribe on componentWillUnmount()

        component.originalComponentWillUnmount = component.componentWillUnmount;
        component.componentWillUnmount = () => {

            if (component.originalComponentWillUnmount) {
                component.originalComponentWillUnmount();
            }
            unsubscribeFromWatcher(component);
        }

    } catch (e) {
        console.log(e);
    }
}

/**
 * @param {object} component - A React stateful/class-based component
 *
 */
function unsubscribeFromWatcher(component) {
    try {

        if (component instanceof ReactComponent && component.reduxActionWatcherSubscriptions !== undefined && typeof component.reduxActionWatcherSubscriptions === "object") {
            for (let actionKey in component.reduxActionWatcherSubscriptions) {
                if (__reduxActionWatcherInternalState.actionSubscriptions[actionKey] !== undefined) {
                    const indexOfComponent = __reduxActionWatcherInternalState.actionSubscriptions[actionKey].indexOf(component);
                    if (indexOfComponent > -1) {
                        __reduxActionWatcherInternalState.actionSubscriptions[actionKey].splice(indexOfComponent, 1);
                    }
                }
            }
        }

    } catch (e) {
        console.log(e);
    }
}



export { subscribeToWatcher };

