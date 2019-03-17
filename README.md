# Redux Action Watcher

[Redux action watcher](https://github.com/salman3k1/redux-action-watcher) is a set of a redux middleware and a helper method that lets you watch for redux actions within your react components and bind callback functions to them when the component is updated/re-rendered due to a state change caused by that specific action. It is especially useful where the action creators invoked are async in nature and when you can't reliably tell which action caused the update; since there can be state changes due to other actions in-between. 

## Getting Started

To install the package using npm you can use
```
npm install redux-action-watcher
```

If you are using yarn you can run
```
yarn add redux-action-watcher
```

### Prerequisites

This package is meant to be used with a react + redux application so your project should include both.

### Usage

First thing that you need to get the package working is to add the middleware to the store configuration.
First make sure that you are importing the applyMiddleware method from the redux package.

```javascript
import { createStore, applyMiddleware } from 'redux';
```

Then you will need to add the import statement for the middleware like so:

```javascript
import {watcher} from 'redux-action-watcher';
```

After that you will need to register the middleware with the store.

```javascript
const store = createStore(
  rootReducer,
  applyMiddleware(watcher)
);
```

Now you can use the helper method to subscribe to actions in either the componentWillMount or componentDidMount lifecycle methods.
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
        }
      },
    ]);
```

The first argument is the component context i-e 'this'. Second Argument is an array of objects each of which has two properties action and callback.
* action is the string notation of the action itself
* callback is the function that will execute as soon as an update to the component occurs due to the specified action.

## Authors

* **Muhammad Salman Abid**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

