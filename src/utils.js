export const getReduxActionWatcherReducerFromState = (state) => {
    const reducer = getObjectWithKeyLevelWise(state, 'reduxActionWatcherId');
    return reducer;
}


function getObjectWithKeyLevelWise(parentObject, keyToSearch) {
    const resultObject = { value: null, nextLevel: {}, levelNumber: 0 };
    const getObjectWithKeyLevelWiseRecursive = function (parentObject, keyToSearch, resultObject) {
        resultObject.levelNumber++;
        resultObject.nextLevel = {};
        for (let objectKey in parentObject) {
            let valueOfKey = parentObject[objectKey];
            if (valueOfKey && typeof valueOfKey === "object") {
                if (valueOfKey.hasOwnProperty(keyToSearch)) {
                    resultObject.value = valueOfKey;
                    return;
                } else {
                    for (let levelDownKey in valueOfKey) {
                        resultObject.nextLevel[levelDownKey] = valueOfKey[levelDownKey];
                    }
                }
            }
        }
        if (resultObject.value) {
            return;
        } else {
            getObjectWithKeyLevelWiseRecursive(resultObject.nextLevel, keyToSearch, resultObject);
            if (resultObject.value) {
                return;
            }
        }
    }
    getObjectWithKeyLevelWiseRecursive(parentObject, keyToSearch, resultObject);
    return resultObject.value
}



function getObjectWithKey(parentObject, keyToSearch) {
    let level = 1;
    const resultObject = { value: null };
    const getObjectWithKeyRecursive = function (parentObject, keyToSearch, resultObject) {
        for (let objectKey in parentObject) {
            let valueOfKey = parentObject[objectKey];
            if (valueOfKey && typeof valueOfKey === "object") {
                if (valueOfKey.hasOwnProperty(keyToSearch)) {
                    resultObject.value = valueOfKey;
                    return;
                } else {
                    getObjectWithKeyRecursive(valueOfKey, keyToSearch, resultObject);
                    if (resultObject.value) {
                        return;
                    }
                }
            }
        }
    }
    getObjectWithKeyRecursive(parentObject, keyToSearch, resultObject);
    return resultObject.value
}