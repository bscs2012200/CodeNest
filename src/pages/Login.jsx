import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Cookies from 'js-cookie';
import Logo from '../assets/codenest.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        if (result.data === "Login successful") {
          Cookies.set('email', email, { expires: 7 });
          navigate('/dashboard');
        } else {
          setErrorMessage("Invalid credentials. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  return (
    <div className='login-container'>
       <div className='topleft'>
    <Link to="/"><h3 style={{color: 'black'}} class="fa fa-arrow-left"></h3></Link>
    
    </div>
      <div className='login-card'>
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
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
            <i className="fa fa-envelope"></i> Email
            </label>
            <input type="email" className="form-control" placeholder = "Enter Your E-Mail" id="email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
            <i className="fa fa-lock"></i> Password
            </label>
            <input type="password" className="form-control" placeholder = "Enter Your Password" id="password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btnsubmit">
            Login
          </button>
          <div className="login-links">
            <Link to="/register">Don't have an account? Register</Link>
            <br />
           
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
