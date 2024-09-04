import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTachometerAlt, faFileAlt, faEdit, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/cnw.png';

const Tnav = ({ isOpen }) => {
  const [teacherProfileData, setTeacherProfileData] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  
  const email = Cookies.get('email');

  const fetchTeacherInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/geteacherinfo/${email}`);
      const teacherProfileData = response.data; 
      setTeacherProfileData({ name: teacherProfileData.name, email: teacherProfileData.email });
    } catch (error) {
      console.error('Error fetching teacher info:', error);
      setAlertMessage('Error fetching teacher info. Please check the Email.');
    }
  };

  useEffect(() => {
    if (email) {
      fetchTeacherInfo();
    }
  }, [email]);

  return (
    <nav className={`vertical-navbar ${isOpen ? 'open' : ''}`}>
      <ul>
        <li><img src={Logo} className="Navlogo" alt="CodeNest Logo"/></li>
        <li className='name'>{teacherProfileData.name}</li>
        <li className='dashb'><Link to="/dashboard"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link></li>
        <li><Link to="/createtest"><FontAwesomeIcon icon={faFileAlt} /> Create test</Link></li>
        <li><Link to="/TestPage"><FontAwesomeIcon icon={faEdit} /> Update test</Link></li>
        <li><Link to="/reset-password"><FontAwesomeIcon icon={faKey} /> Reset Password</Link></li>
        <li className='logout'><Link to="/login"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Tnav;
