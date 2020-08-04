import { takeLatest, all, call, put } from 'redux-saga/effects';
import autoBind from 'auto-bind';
import { promisify } from 'util';
import axios from 'axios';
import * as types from '../constants/action-types';
import { GAPI_PARAMS } from '../constants/google-api';
import {
  googleSignInSuccess,
  googleSignOutSuccess,
  fetchAlbumsSuccess,
  fetchPhotosSuccess
} from '../actions/google-api';

class GoogleApiSagas {
  gapi = window.gapi;
  authInstance = null;
  currentUser = null;

  constructor() {
    autoBind(this);
  }

  waitForLoadGapi() {
    return new Promise((resolve, reject) => {
      if (this.gapi) {
        resolve();
        return;
      }
      let counter = 0;
      let gapiSetter = setInterval(() => {
        if (window.gapi) {
          clearInterval(gapiSetter);
          this.gapi = window.gapi;
          resolve();
        } else {
          counter += 1
          if (counter >= 20) {
            reject('Failed to load google api client.')
          }
        }
      }, 100);
    });
  }

  * watchGapiInitSaga() {
    yield takeLatest(types.GAPI_INIT_START, this.gapiInitSaga);
  }

  * gapiInitSaga() {
    try {
      yield call(this.waitForLoadGapi);
      yield call(promisify(this.gapi.load), 'auth2');
      yield call(this.gapi.auth2.init, GAPI_PARAMS);
      this.authInstance = yield call(this.gapi.auth2.getAuthInstance);
      yield call(this.googleSignInCheckSaga);
    } catch (error) {
      console.log(error)
    }
  }

  * watchGoogleSignInSaga() {
    yield takeLatest(types.GOOGLE_SIGN_IN_START, this.googleSignInSaga);
  }

  * googleSignInCheckSaga() {
    const isSignedIn = yield call(this.authInstance.isSignedIn.get.bind(this.authInstance.isSignedIn));
    if (isSignedIn) {
      yield call(this.googleSignInSaga);
    }
  }

  * googleSignInSaga() {
    try {
      const isSignedIn = yield call(this.authInstance.isSignedIn.get.bind(this.authInstance.isSignedIn));
      if (!isSignedIn) {
        yield call(this.authInstance.signIn.bind(this.authInstance));
      }
      this.currentUser = yield call(this.authInstance.currentUser.get.bind(this.authInstance.currentUser));
      const userProfile = yield call(this.currentUser.getBasicProfile.bind(this.currentUser));
      yield call(this.googleSignInSuccesSaga, userProfile);
      console.log('signed in')
    } catch (error) {
      console.log(error)
    }
  }

  * googleSignInSuccesSaga(userProfile) {
    yield put(googleSignInSuccess(userProfile));
  }

  * watchGoogleSignOutSaga() {
    yield takeLatest(types.GOOGLE_SIGN_OUT_START, this.googleSignOutSaga);
  }

  * googleSignOutSaga() {
    try {
      yield call(this.authInstance.signOut.bind(this.authInstance));
      yield put(googleSignOutSuccess());
      console.log('signed out')
    } catch (error) {
      console.log(error)
    }
  }

  * watchFetchAlbumsSaga() {
    yield takeLatest(types.FETCH_ALBUMS_START, this.fetchAlbumsSaga);
  }

  * fetchAlbumsSaga() {
    try {
      const userAuth = yield call(this.getAuthResponseSaga);
      const response = yield call(axios.get,
        'https://photoslibrary.googleapis.com/v1/sharedAlbums',
        {
          headers: {
            Authorization: `${userAuth.token_type} ${userAuth.access_token}`
          }
        }
      );
      const albumsInfo = {};
      response.data.sharedAlbums.forEach(album => {
        albumsInfo[album.id] = album;
      });
      yield put(fetchAlbumsSuccess(albumsInfo));
    } catch (error) {
      console.log(error)
    }
  }

  * watchFetchPhotosSaga() {
    yield takeLatest(types.FETCH_PHOTOS_START, this.fetchPhotosSaga);
  }

  * fetchPhotosSaga(action) {
    const { albumId, pageToken } = action.payload;
    try {
      const userAuth = yield call(this.getAuthResponseSaga);
      const response = yield call(axios.post,
        'https://photoslibrary.googleapis.com/v1/mediaItems:search',
        {
          pageSize: 100,
          albumId,
          pageToken
        },
        {
          headers: {
            Authorization: `${userAuth.token_type} ${userAuth.access_token}`
          }
        }
      );

      const { mediaItems, nextPageToken } = response.data;
      const mediaItemsMap = {}
      mediaItems.forEach(photo => {
        mediaItemsMap[photo.id] = photo;
      });
      const album = {
        id: albumId || 'all',
        mediaItems: mediaItemsMap,
        nextPageToken
      }
      yield put(fetchPhotosSuccess(album));
    } catch (error) {
      console.log(error)
    }
  }

  * getAuthResponseSaga() {
    if (this.currentUser) {
      return yield call(this.currentUser.getAuthResponse.bind(this.currentUser), true);
    } else {
      throw Error('User not signed in.');
    }
  }

  * all() {
    yield all([
      call(this.watchGapiInitSaga),
      call(this.watchGoogleSignInSaga),
      call(this.watchGoogleSignOutSaga),
      call(this.watchFetchAlbumsSaga),
      call(this.watchFetchPhotosSaga)
    ]);
  }
}

const googleApiSagas = new GoogleApiSagas();
export default googleApiSagas.all;