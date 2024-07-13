import React, { useState, useEffect } from 'react';
import CycleRental from './CycleRental';
import Auth from './Auth';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <div className="App">
      {token ? <CycleRental token={token} setToken={setToken} /> : <Auth setToken={setToken} />}
    </div>
  );
}

export default App;