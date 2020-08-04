import { combineReducers } from 'redux';
import googleApiReducer from './google-api'

const rootReducer = combineReducers({
  googleApi: googleApiReducer
});

export default rootReducer;