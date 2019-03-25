import ReduxActionWatcherInternalState from './ReduxActionWatcherInternalState';
import { getReduxActionWatcherReducerFromState } from './utils';
const __reduxActionWatcherInternalState = new ReduxActionWatcherInternalState();

const reduxActionWatcherEnhancer = createStore => (
    reducer,
    initialState,
    enhancer
) => {

    const receivedReducer = (state, action) => {
        __reduxActionWatcherInternalState.reduxActionWatcherId++;
        // We need to set the reduxActionWatcherId for both prev and newState to above value so that they remain equal and don't 
        // return a false equality check in subscibe callback because of this reducer.
        // Mainly a sanity check since we always return default state from this reducer but just in case someone tries to mutate it with
        // another middleware or so, it should be kept in place for now. Can be reviewed later
        let watcherReducer;
        if (state) {
            watcherReducer = getReduxActionWatcherReducerFromState(state);
            if (!watcherReducer) {
                throw new Error("Redux Action Watcher Reducer Not Found On Root Reducer");
            }
            watcherReducer.reduxActionWatcherId = __reduxActionWatcherInternalState.reduxActionWatcherId;
        }
        const actionsQueueObject = { prevState: state, currentState: null, reduxActionWatcherId: __reduxActionWatcherInternalState.reduxActionWatcherId, action: action.type };
        const newState = reducer(state, action);
        watcherReducer = getReduxActionWatcherReducerFromState(newState);
        if (!watcherReducer) {
            throw new Error("Redux Action Watcher Reducer Not Found On Root Reducer");
        }
        watcherReducer.reduxActionWatcherId = __reduxActionWatcherInternalState.reduxActionWatcherId;
        actionsQueueObject.currentState = newState;
        __reduxActionWatcherInternalState.actionsQueue.push(actionsQueueObject);
        return newState;
    }
    const store = createStore(receivedReducer, initialState, enhancer);

    store.subscribe(() => {
        // console.log("Invoking Subscriptions");
        invokeWatcherSubscriptions(store);
    });

    return store;
}

function invokeWatcherSubscriptions(store) {
    let storeStateReceived = store.getState();
    let watcherReducer = getReduxActionWatcherReducerFromState(storeStateReceived);
    if (!watcherReducer) {
        throw new Error("Redux Action Watcher Reducer Not Found On Root Reducer");
    }

    // Process All actionQueueObjects till the received state's reduxActionWatcherId
    const reduxActionWatcherId = watcherReducer.reduxActionWatcherId;
    const equal = require('deep-equal');
    // Take the elements that need to be processed into another array and remove from  __reduxActionWatcherInternalState.actionsQueue
    // Otherwise if the callbacks are dispatching actions themselves it will go into an infinite recursion

    let actionQueueIndex;
    for (actionQueueIndex = 0; actionQueueIndex < __reduxActionWatcherInternalState.actionsQueue.length; actionQueueIndex++) {
        let actionQueueObject = __reduxActionWatcherInternalState.actionsQueue[actionQueueIndex];
        //Break if the actionQueueObject's reduxActionWatcherId gets larger than the one received in store state. 
        //It means that the results of that state are still to arrive 
        if (actionQueueObject.reduxActionWatcherId > reduxActionWatcherId) {
            break;
        }
    }
    const actionQueueObjectsToProcess = __reduxActionWatcherInternalState.actionsQueue.slice(0, actionQueueIndex);
    __reduxActionWatcherInternalState.actionsQueue.splice(0, actionQueueIndex);

    const processSubscriptions = () => {
        return new Promise((resolve, reject) => {
            //Set timeout is a hack used to cover a few extreme usecases based in async calls where the state change would be reflected in the app after a very little delay
            //TODO: Need a proper solution for this issue 
            setTimeout(() => {
                try {
                    for (actionQueueIndex = 0; actionQueueIndex < actionQueueObjectsToProcess.length; actionQueueIndex++) {
                        let actionQueueObject = actionQueueObjectsToProcess[actionQueueIndex];
                        let statesAreEqual = equal(actionQueueObject.prevState, actionQueueObject.currentState);
                        if (__reduxActionWatcherInternalState.actionSubscriptions[actionQueueObject.action] !== undefined) {
                            for (let component of __reduxActionWatcherInternalState.actionSubscriptions[actionQueueObject.action]) {
                                const componentSubscriptionToAction = component.reduxActionWatcherSubscriptions[actionQueueObject.action];
                                if (componentSubscriptionToAction !== undefined) {
                                    if (!statesAreEqual || !componentSubscriptionToAction.onStateChange) {
                                        component.processWatcherSubscription(actionQueueObject.action);
                                    }
                                }
                            }
                        }
                    }
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            }, 10);


        });
    }

    processSubscriptions();

}

export default reduxActionWatcherEnhancer;