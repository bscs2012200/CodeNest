import React, { useState } from 'react';
import './Hamburger.css';

const Hamburger = ({ isOpen, toggleMenu }) => {
    return (
      <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    );
  };

export default Hamburger;
