import { merge } from 'lodash';
import * as types from '../constants/action-types';

const INITIAL_STATE = {
  userProfile: null,
  photos: {
    albumsInfo: null,
    albums: {
      all: {
        mediaItems: {},
        nextPageToken: null
      }
    }
  }
}

export default function googleApiReducer(state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case types.GOOGLE_SIGN_IN_SUCCESS:
      return {
        ...state,
        userProfile: payload
      }
    case types.GOOGLE_SIGN_OUT_SUCCESS:
      return {
        ...state,
        userProfile: null
      }
    case types.FETCH_ALBUMS_SUCCESS:
      return {
        ...state,
        photos: {
          ...state.photos,
          albumsInfo: payload
        }
      }
    case types.FETCH_PHOTOS_SUCCESS:
      let { id, ...newAlbumData } = payload;
      return {
        ...state,
        photos: {
          ...state.photos,
          albums: {
            ...state.photos.albums,
            [id]: merge({}, state.photos.albums[id], newAlbumData)
          }
        }
      }
    default:
      return state;
  }
}