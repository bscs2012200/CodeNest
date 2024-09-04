import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Resetpassword.css';
import Logo from '../assets/codenest.png';
import Sidebar from "../components/sidebar.jsx";
import Hamburger from '../components/Hamburger';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleAuthenticate = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        if (result.data === "Login successful") {
          setAuthenticated(true);
          setErrorMessage("Authentication successful");
        } else {
          setErrorMessage("Authentication failed");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/reset-password', { email, password: newPassword })
      .then(result => {
        setErrorMessage("Password update successful");
        navigate('/login');
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  return (
    <div className='reset-container'>
      <Sidebar />
    <div className='r-container'>
       
      <div className='r-card'>
        <div className="logo-container">
          <img src={Logo} className="CNlogo" alt="CodeNest Logo"/>
        </div>
        <h2 className="fw-bold fs-5" style={{textAlign: 'center'}}>Reset your password</h2>
        {errorMessage && (
          <div className={`alert ${errorMessage.includes('successful') ? 'alert-success' : 'alert-danger'}`} role="alert">
            {errorMessage}
          </div>
        )}
        {!authenticated ? (
          <form onSubmit={handleAuthenticate}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="fa fa-envelope"></i> Email
              </label>
              <input type="email" className="form-control" placeholder="Enter Your E-Mail" id="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                <i className="fa fa-lock"></i> Password
              </label>
              <input type="password" className="form-control" placeholder="Enter Your Password" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btnsubmit">Authenticate</button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input type="password" className="form-control" id="newPassword" placeholder="Enter Your New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="btnsubmit">Update Password</button>
          </form>
        )}
      </div>
    </div>
    </div>
  );
}

export default ResetPassword;
