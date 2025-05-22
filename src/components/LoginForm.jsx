import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
    <div className="form-group">
      <label>Username:</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <button type="submit">Login</button>
    </div>
  </form>
  
  );
};

export default LoginForm;
