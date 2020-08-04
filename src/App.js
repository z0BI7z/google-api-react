import React from 'react';
import './App.css';

function App({ history }) {

  return (
    <div className="App">
      <header className="App-header">
        hello
        <button onClick={() => history.push('/account')}>Account</button>
      </header>
    </div>
  );
}

export default App;
