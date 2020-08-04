import { all, call } from 'redux-saga/effects';
import googleApiSagas from './google-api';

export default function* rootSagas() {
  yield all([
    call(googleApiSagas)
  ]);
}