import React, { useState } from 'react';
import axios from 'axios';
import Tnav from '../components/Tnav';
import Hamburger from '../components/Hamburger';
Hamburger
function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAuthenticate = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result);
        if (result.data === "Login successful") {
          setAuthenticated(true);
          setAlertMessage("Authentication successful")
        } else {
          setAlertMessage("Authentication failed")
        }
      })
      .catch(err => console.log(err));
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/reset-password', { email, password: newPassword })
      .then(result => {
        console.log(result);
        setAlertMessage("Password update successful")

        
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="reset-password">
      <Tnav {...{ isOpen }} />
      <Hamburger isOpen={isOpen} toggleMenu={toggleMenu} />
      {alertMessage && (
        <div
          className={`alert ${alertMessage.includes('successful') ? 'alert-success' : 'alert-danger'}`}
          role='alert'
        >
          {alertMessage}
        </div>
      )}

      {!authenticated ? (
        <form onSubmit={handleAuthenticate}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Authenticate</button>
        </form>
      ) : (
        <form onSubmit={handleUpdatePassword}>
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <button type="submit">Update Password</button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;
