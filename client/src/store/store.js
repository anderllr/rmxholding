import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducer from './reducers';
import rootSaga from './sagas';

const rootReducer = combineReducers({
    reducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

//fetch initial data
store.dispatch({ type: "FETCH_SEARCH_DATA", payload: { firstName: "*" } })

export default store;
