import * as types from '../constants/action-types';

export const gapiInit = () => ({
  type: types.GAPI_INIT_START
});

export const googleAuthStateChanged = () => ({
  type: types.GOOGLE_AUTH_STATE_CHANGED
});

export const googleSignIn = () => ({
  type: types.GOOGLE_SIGN_IN_START
});

export const googleSignInSuccess = userProfile => ({
  type: types.GOOGLE_SIGN_IN_SUCCESS,
  payload: userProfile
});

export const googleSignOut = () => ({
  type: types.GOOGLE_SIGN_OUT_START
});

export const googleSignOutSuccess = () => ({
  type: types.GOOGLE_SIGN_OUT_SUCCESS
});

export const fetchAlbums = () => ({
  type: types.FETCH_ALBUMS_START
});

export const fetchAlbumsSuccess = albumsInfo => ({
  type: types.FETCH_ALBUMS_SUCCESS,
  payload: albumsInfo
});

export const fetchPhotos = parameters => ({
  type: types.FETCH_PHOTOS_START,
  payload: parameters || {}
});

export const fetchPhotosSuccess = album => ({
  type: types.FETCH_PHOTOS_SUCCESS,
  payload: album
});