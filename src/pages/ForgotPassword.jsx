import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';
import Logo from '../assets/codenest.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 
    axios.post('http://localhost:3001/send-otp', { email })
      .then(result => {
        setLoading(false);
        if (result.data === "OTP sent") {
          setStep(2);
          setSuccessMessage("OTP has been sent to your email.");
        } else {
          setErrorMessage("Unable to send OTP. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/verify-otp', { email, otp })
      .then(result => {
        if (result.data === "OTP verified") {
          setErrorMessage('');
          setStep(3);
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400 && err.response.data === "Invalid OTP") {
          setErrorMessage("Invalid OTP. Please try again.");
        } else {
          console.error(err);
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  };
  

  const handlePasswordReset = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/reset-password', { email, password: newPassword })
      .then(result => {
        if (result.data === "Password updated successfully") {
          setSuccessMessage("Password has been reset successfully.");
          navigate('/login');
        } else {
          setErrorMessage("Unable to reset password. Please try again.");
        }
      })
      .catch(err => {
        console.error(err);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setErrorMessage('');  
    setSuccessMessage('');  
  };

  
  return (
    <div className='forgot-password-container'>
      <div className='topleft'>
        <Link to="/"><h3 style={{color: 'black'}} className="fa fa-arrow-left"></h3></Link>
      </div>
      <div className='forgot-password-card'>
        <div className="logo-container">
          <img src={Logo} className="CNlogo" alt="CodeNest Logo"/>
        </div>
        <h2 className="fw-bold fs-5" style={{textAlign: 'center'}}>Forgot Password</h2>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        {loading && (
          <div className="loader"></div> // Loader is shown while loading is true
        )}
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="fa fa-envelope"></i> Email
              </label>
              <input type="email" className="form-control" placeholder="Enter Your E-Mail" id="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btnsubmit">
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">
                <i className="fa fa-key"></i> OTP
              </label>
              <input type="text" className="form-control" placeholder="Enter OTP" id="otp" onChange={handleOtpChange} />

            </div>
            <button type="submit" className="btnsubmit">
              Verify OTP
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                <i className="fa fa-lock"></i> New Password
              </label>
              <input type="password" className="form-control" placeholder="Enter New Password" id="newPassword" onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <button type="submit" className="btnsubmit">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
