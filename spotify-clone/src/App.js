import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Store } from './components/Store/Store';
import Appcontent from './Appcontent';

const App = () => {
  return (
    <Provider store={Store}>
      <Appcontent />
    </Provider>
  );
};

export default App;
