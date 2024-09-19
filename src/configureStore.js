import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import reducers from './model';

const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.nav,
);

const config = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['nav']
}

const persistReducers = persistCombineReducers(config , reducers);


export default function configureStore() {
    let store = createStore(
        persistReducers,
        applyMiddleware(thunk, middleware)
    )
    let persistor = persistStore(store)
    return {store, persistor}
}