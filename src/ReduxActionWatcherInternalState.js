export default class ReduxActionWatcherInternalState {
    static instanceCreated = false;
    static instance = null;
    actionInProcess = null;
    reduxActionWatcherId = 0;
    actionsQueue = [];
    actionSubscriptions = {};

    constructor() {
        if (!ReduxActionWatcherInternalState.instanceCreated) {
            ReduxActionWatcherInternalState.instanceCreated = true;
            ReduxActionWatcherInternalState.instance = new ReduxActionWatcherInternalState();
        }
        return ReduxActionWatcherInternalState.instance;
    }


}