import React, { Component } from 'react';
// import MainNavigation from './src/router/routes';
// import configureStore from "./src/configureStore";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import reducers from './src/model/rootReducer';
import Navigation from './src/router/navigation';

const store = createStore(reducers, applyMiddleware(thunk))
// const { store } = configureStore();

class App extends Component{
  render(){
    return (
      <Provider store={store}>
        {/* <MainNavigation/> */}
        <Navigation/>
      </Provider>
    );
  }
}

export default App;