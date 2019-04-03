# Redux Action Watcher
>Ver 2.0.x is a complete re-write of previous package that was basically a middleware. If you were using the previous version before, only the setup part of the package has changed and subscriptions still use the old pattern. This means that you can easily upgrade by just tweaking the initial setup.

[Redux action watcher](https://github.com/salman3k1/redux-action-watcher) is a set of a redux enhancer, reducer and a helper method that lets you watch for redux actions within your react components and bind callback functions to them. The previous versions of this package relied on component update. This limitation has now been covered with the latest revision. Redux Action Watcher is especially useful where the action creators invoked are async in nature and when you can't reliably tell which action caused the update; since there can be state changes due to other actions in-between. Another powerful usecase covered in this version is that you can watch for any action and provide a callback to be invoked even if there was no actual change in the application state.

## Getting Started

To install the package using npm you can use
```
npm install --save redux-action-watcher
```

If you are using yarn you can run
```
yarn add redux-action-watcher
```

### Prerequisites

This package is meant to be used with a react + redux application so your project should include both.

### Usage

First thing that you need to get the package working is to add the enhancer to the store configuration.
First make sure that you are importing the compose method from the redux package.

```javascript
import { createStore, applyMiddleware,compose } from 'redux';
```

Then you will need to add the import statement for the enhancer like so:

```javascript
import { watcherEnhancer } from 'redux-action-watcher';
```

After that you will need to register the enhancer with the store.

```javascript
const enhancers = compose(
  applyMiddleware(),
  watcherEnhancer
);
const store = createStore(
  rootReducer,
  enhancers
);
```
Last but not the least, add the reducer that comes with the package to your reducers. Import the reducer and combineReducers methods from the respective packages

```javascript
import { combineReducers } from 'redux';
import {reduxActionWatcherReducer} from 'redux-action-watcher'
```

Then add reducer to the array passed to combineReducers method

```javascript
const rootReducer = combineReducers({
  ..otherReducers,
  reduxActionWatcherReducer
});
```
## Subscribing

If you have completed the setup explained above, you can now use the helper method to subscribe to actions in either the componentWillMount or componentDidMount lifecycle methods in your react components.

First import the method.

```javascript
import { subscribeToWatcher } from 'redux-action-watcher';
```

Then in your componentWillMount or componentDidMount method, use it as follows:

```javascript
 subscribeToWatcher(this,[
      {  
        action:"SOME_ACTION",
        callback:()=>{
          console.log("Callback Working");
        },
        onStateChange:true
      },
    ]);
```

The first argument is the component context i-e 'this'. Second Argument is an array of objects each of which has three properties action, callback and onStateChange.
* action is the string notation of the action itself
* callback is the function that will execute as soon as state updation process from the reducer is completed.
* onStateChange is optional and will be set to true by default. If set to false it will invoke the callback regardless of a change in application state.

## Unsubscribing

To prevent memory leaks it is necessary to unsubscribe from watcher in the componentWillUnmount lifecycle method. This will revoke all subscriptions on the component. Manually unsubscribing from certain actions is a work in progress and this feature will be available soon. 

```javascript
componentWillUnmount(){
    this.unsubscribeFromWatcher();
}
```


## Authors

* **Muhammad Salman Abid**

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/salman3k1/redux-action-watcher/blob/master/LICENSE.md) file for details

