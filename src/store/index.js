import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import rootReducer from '../reducers/index';
import rootSagas from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();

const middleware = [
  logger,
  sagaMiddleware
]

export const store = createStore(rootReducer, applyMiddleware(...middleware));

sagaMiddleware.run(rootSagas);