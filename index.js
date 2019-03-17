let __watcherAction = "";

/*
 * Middleware
 */
export const watcher = store => next => action => {
    __watcherAction = action.type;
    const result = next(action);
    return result
}

/**
 * @param {object} component - A React stateful/class-based component
 * @param {array} actionsAndCallbacksArray - An array of objects each of which has two properties action and callback where action is the string notation of the action itself and callback is the function that will execute as soon as an update to the component occurs due to the specified action.
 *
 */
export const subscribeToWatcher = (component, actionsAndCallbacksArray) => {
    try{
        component.originalComponentDidUpdate = component.componentDidUpdate;
        component.componentDidUpdate = (prevProps, prevState) => {
            if(component.originalComponentDidUpdate){
                component.originalComponentDidUpdate(prevProps, prevState);
            }
            for (let action of actionsAndCallbacksArray) {
                if (action.action === __watcherAction) {
                    if(typeof action.callback === 'function'){
                        action.callback();
                    }else{
                        throw new TypeError(action.callback + ' is not a function');
                    }
                }
            }
        }
    }catch(e){
        console.log(e);
    }
}