import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/cnw.png';

const Sidebar = () => {
  return (
    <div style={{ display: 'flex', height: '100vh',flexDirection: 'column' }}>
      <CDBSidebar
        textColor="#fff"
        backgroundColor='#130f40'
        backgroundImage='linear-gradient(315deg, #130f40 0%, #000000 74%)'
        className="sidebar-fixed"
      >
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        <img src={Logo} className="Navlogo" alt="CodeNest Logo"/>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/studentdash" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/at" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="file">Attempt test</CDBSidebarMenuItem>
            </NavLink>
           
            
            
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter>
          <div>
            <NavLink exact to="/studentlogin" activeClassName="activeClicked" style={{color:'white'}}>
              <CDBSidebarMenuItem icon="fa fa-sign-out-alt">Logout</CDBSidebarMenuItem>
            </NavLink>
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
