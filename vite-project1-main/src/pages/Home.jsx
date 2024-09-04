import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/cnw.png';
import './home.css';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate('/studentlogin');
    };
    
    const handleNavigation2 = () => {
        navigate('/login');
    };

    return (
        <body className='hbody'>
        <div>
            
        <div class="logo-container">
      <img src={Logo} className="homepagelogo" alt="CodeNest Logo"/>
      </div>
            <h1 className='typewriter' style={{textAlign: 'center'}}>Welcome to CodeNest</h1>
            <div className="buttonContainer">
            
                <button onClick={handleNavigation2} className='button99'><i class='fas fa-chalkboard-teacher'></i>Login as Teacher</button>
                <button  onClick={handleNavigation} className='button99' style={{marginLeft:'25px'}}><i class='fas fa-user-graduate'></i>Login as Student</button>
            </div>
        </div>
        </body>
    );
};

export default Home;
