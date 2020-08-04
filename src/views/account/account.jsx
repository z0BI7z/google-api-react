import React from 'react';
import { connect } from 'react-redux';
import { gapiInit, googleSignIn, googleSignOut, fetchAlbums, fetchPhotos } from '../../actions/google-api';

function Account({ gapiInit, googleSignIn, googleSignOut, fetchAlbums, fetchPhotos }) {
  return <div>
    Account
    <button onClick={gapiInit}>GAPI Init</button>
    <button onClick={googleSignIn}>Google Sign In</button>
    <button onClick={googleSignOut}>Google Sign Out</button>
    <button onClick={fetchAlbums}>Fetch Albums</button>
    <button onClick={() => fetchPhotos()}>Fetch Photos</button>
  </div>
}

const mapDispatchToProps = dispatch => ({
  gapiInit: () => dispatch(gapiInit()),
  googleSignIn: () => dispatch(googleSignIn()),
  googleSignOut: () => dispatch(googleSignOut()),
  fetchAlbums: () => dispatch(fetchAlbums()),
  fetchPhotos: albumId => dispatch(fetchPhotos(albumId))
});

export default connect(null, mapDispatchToProps)(Account);