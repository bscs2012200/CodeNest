import React, { useState,useEffect } from 'react';

import { useNavigate,Link } from 'react-router-dom';
import './std.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import bp from '../assets/programmer.png';
import Sidebar2 from '../components/sidebar2.jsx';
const Std_Dash = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); 
  const regno = Cookies.get('regno');
  const [error, setError] = useState(null); 
  const [studentProfile, setStudentProfile] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = () => {
    navigate('/at');
  };
  const handleNavigation2 = () => {
    navigate('/liveIDE');
  };
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


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); 

    
    return () => clearInterval(interval);
  }, []); 

  
  const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className='dashboard-container'>
       <Sidebar2 />
       <div className='page'>
      <div className='welcome'>
      <img src={bp} className='programmer'></img>
      <h4 className='date'> {formatDate(currentDate)}</h4>
      <div className='dhead'>
      {studentProfile && <h2 className='name'> Welcome back, {studentProfile.name}</h2>}
      </div>
     
      </div>
     <br></br>
     <div className='button-container'></div>
     <button onClick={() => handleNavigation('/at')} className='button99' style={{marginLeft:'25%'}} >
          Attempt test
        </button>
        <button onClick={() => handleNavigation2()} className='button99' style={{marginLeft:'2%'}} >
          Practice environment
        </button>
        
        
    </div>
    </div>
  );
};

export default Std_Dash;
