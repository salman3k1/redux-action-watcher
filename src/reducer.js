const reduxActionWatcherState = {
  reduxActionWatcherId: 0,
}
export default function reduxActionWatcherReducer(state = reduxActionWatcherState, action) {
  switch (action.type) {
    default:
      return state;
  }
}