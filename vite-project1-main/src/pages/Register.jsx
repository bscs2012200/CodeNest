import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import Logo from '../assets/codenest.png';
function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState(null);

  const isEmailValid = (email) => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!name) {
      setAlertMessage('Please enter your full name');
      return;
    }
    if (!email) {
      setAlertMessage('Please enter your email');
      return;
    }
    if (!password) {
      setAlertMessage('Please enter your password');
      return;
    }

    
    if (!isEmailValid(email)) {
      setAlertMessage('Please enter a valid email address');
      return;
    }

    axios
      .post('http://localhost:3001/register', { name, email, password })
      .then((result) => {
        setAlertMessage('Account created');
        console.log(result);
      })
      .catch((err) => {
        setAlertMessage('Account already exists');
        console.log(err);
      });
  };

  return (
    <>
     <div className='login-container'>
      <div className='login-card'>
      <div class="logo-container">
      <img src={Logo} className="CNlogo" alt="CodeNest Logo"/>
      </div>
      <h1 className='heading'>Register Yourself!</h1>
     
        {alertMessage && (
          <div
            className={`alert ${
              alertMessage.includes('Account created') ? 'alert-success' : 'alert-danger'
            }`}
            role='alert'
          >
            {alertMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
            <i className="fa fa-user"></i> Name
            </label>
            <input type='text' className='form-control' id='name' placeholder = "Enter Your Full Name"onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
            <i className="fa fa-envelope"></i> Email
            </label>
            <input type='email' className='form-control' id='email' placeholder = "Enter Your E-Mail" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
            <i className="fa fa-lock"></i> Password
            </label>
            <input type='password' className='form-control' id='password' placeholder = "Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type='submit' className='btnsubmit'>
            Register
          </button>
          <div className='login-links'>
            <Link to='/login'>Already registered? Log in</Link>
            <br />
            <Link to='/'>Home page</Link>
          </div>
        </form>
      </div>
      </div>
      
    </>
  );
}

export default Register;
