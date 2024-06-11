import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Login.css';
import Logo from '../assets/codenest.png';

function Login() {
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post('http://localhost:3001/stdlogin', { regno, password });
      console.log(result);
      if (result.data === 'Login successful') {
        Cookies.set('regno', regno, { expires: 7 });
        navigate('/studentdash');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-container">
    <div className='topleft'>
    <Link to="/"><h3 style={{color: 'black'}} class="fa fa-arrow-left"></h3></Link>
    
    </div>
      <div className="login-card">
      <div class="logo-container">
      <img src={Logo} className="CNlogo" alt="CodeNest Logo"/>
      </div>
      <h2 className="fw-bold fs-5" style={{textAlign: 'center'}}>Sign in to your account</h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="regno" className="form-label">
            <i className="fa fa-id-card"></i> Student ID
            </label>
            <input type="text" className="form-control" placeholder = "Enter Your Student ID number"id="regno" value={regno} onChange={(e) => setRegno(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
            <i className="fa fa-lock"></i> Password
            </label>
            <input type="password" className="form-control"placeholder = "Enter Your Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btnsubmit">
            Login
          </button>
        </form>
        <div className="login-links">
          <Link to="/studentreg">Don't have an account? Register</Link>
          <br />
          
        </div>
      </div>
    </div>
  );
}

export default Login;
