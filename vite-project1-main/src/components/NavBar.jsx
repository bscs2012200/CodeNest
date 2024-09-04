import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTachometerAlt, faSignOutAlt, faCode,faFileAlt,faEdit,faKey } from '@fortawesome/free-solid-svg-icons'; // Change faCodeAlt to faCode
import Logo from '../assets/cnw.png';

const NavBar = ({ isOpen }) => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [error, setError] = useState(null); // Define error state
  const regno = Cookies.get('regno');
  
  // Move fetchStudentInfo inside the component
  const fetchStudentInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/getstudentinfo/${regno}`);
      const studentProfileData = response.data; 
      setStudentProfile({ name: studentProfileData.name, regno: studentProfileData.regno });
    } catch (error) {
      console.error('Error fetching student info:', error);
      setError('Error fetching student info. Please check the Registration Number.');
    }
  };

  useEffect(() => {
    if (regno) {
      fetchStudentInfo();
    }
  }, [regno]);

  console.log('Student Registration Number:', regno);
  
  return (
    <nav className={`vertical-navbar ${isOpen ? 'open' : ''}`}>
    <ul>
      <li><img src={Logo} className="Navlogo" alt="CodeNest Logo"/></li>
      {studentProfile && <li className='name'>{studentProfile.name}</li>}
      <li className='dashb'><Link to="/studentdash"><FontAwesomeIcon icon={faTachometerAlt} /> Dashboard</Link></li>
      <li><Link to="/liveIDE"><FontAwesomeIcon icon={faCode} /> IDE</Link></li>
      <li className='logout'><Link to="/studentlogin"><FontAwesomeIcon icon={faSignOutAlt} /> Logout</Link></li>
    </ul>
  </nav>
    
  );
};

export default NavBar;

