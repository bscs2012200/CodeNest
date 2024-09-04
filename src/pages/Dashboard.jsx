import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import bp from '../assets/boy.png';
import './dashboard.css';
import Sidebar from '../components/sidebar';

const Dashboard = () => {
  const [teacherProfileData, setTeacherProfileData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const email = Cookies.get('email');

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

  const handleCreateTest = () => {
    navigate('/createtest');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const fetchTeacherInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/geteacherinfo/${email}`);
      const teacherProfileData = response.data;
      setTeacherProfileData({ name: teacherProfileData.name, email: teacherProfileData.email });
    } catch (error) {
      console.error('Error fetching teacher info:', error);
      // Handle error gracefully, maybe display a message to the user
    }
  };

  useEffect(() => {
    if (email) {
      fetchTeacherInfo();
    }
  }, [email]);

  return (
    <div className='dashboard-container'>
    <Sidebar />
    <div className='page'>
      <div className='welcome'>
        <img src={bp} className='boy' alt='boy' />
        <h4 className='date'>{formatDate(currentDate)}</h4>
        <div className='dhead'>
          {teacherProfileData && <h2>Welcome back, {teacherProfileData.name}!</h2>}
        </div>
      </div>
      <div className='button-container'>
        <button onClick={() => handleNavigation('/createtest')} className='button99'>
          Create Test
        </button>
        <button onClick={() => handleNavigation('/listid')} className='button99'style={{marginLeft:'10px'}}>
          Update test
        </button>
        <button onClick={() => handleNavigation('/s')} className='button99'style={{marginLeft:'10px'}}>
          Grade test
        </button>
      </div>
    </div>
  </div>
  
  );
};

export default Dashboard;
