import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Logo from '../assets/codenest.png';
function Std_reg() {
  const [name, setName] = useState('');
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

   
    setError('');
    setAlertMessage('');

    
    if (!name) {
      setError('Please Enter your name');
      return;
    }
    if (!regno) {
      setError('Please Enter your registration.');
      return;
    }
    if (!password) {
      setError('Please enter password.');
      return;
    }

    
    if (!/^\d{7}$/.test(regno)) {
      setError('Student ID must be a 7-digit number.');
      return;
    }

   
    axios
      .post('http://localhost:3001/Stdregister', { name, regno, password })
      .then((response) => {
        if (response.data === 'Already have an account') {
          setAlertMessage({ type: 'danger', message: 'Account already exists. Please log in.' });
        } else if (response.data === 'Account created') {
          setAlertMessage({ type: 'success', message: 'Account created successfully.' });
        }
      })
      .catch((err) => {
        setAlertMessage({ type: 'danger', message: 'Account registration failed. Please try again.' });
      });
  };

  return (
    <>
       <div className='login-container'>
      <div className='login-card'>
      <div class="logo-container">
      <img style={{marginRight:'30px'}} src={Logo} className="CNlogo" alt="CodeNest Logo"/>
      </div>
      <h1 className="fw-bold fs-2" style={{textAlign: 'center'}}>Student registration form</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className='alert alert-danger'>{error}</div>}
          {alertMessage && <div className={`alert alert-${alertMessage.type}`}>{alertMessage.message}</div>}
          <div className='mb-3'>
            <label htmlFor='name' className='form-label'>
            <i className="fa fa-user"></i> Name
            </label>
            <input type='text' className='form-control' id='name' placeholder = "Enter Your Full Name" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor='regno' className='form-label'>
            <i className="fa fa-id-card"></i> Student ID
            </label>
            <input type='text' className='form-control' id='regno' placeholder = "Enter Your Student ID Number"onChange={(e) => setRegno(e.target.value)} />
          </div>
          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
            <i className="fa fa-lock"></i> Password
            </label>
            <input type='password' className='form-control' id='password' placeholder = "Enter Your Password"onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type='submit' className='btnsubmit'>
            Register
          </button>
          <div className='login-links'>
            <Link to='/studentlogin'>Already registered? Log in</Link>
            <br></br>
          </div>
        </form>
      </div>
      </div>
    </>
  );
}

export default Std_reg;
