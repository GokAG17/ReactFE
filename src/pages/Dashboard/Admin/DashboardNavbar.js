import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutContainer} from './Style';
import { Layout, Menu, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import '../CSS/DashboardNavbar.css';
import config from '../../../config';

const apiUrl = config.apiUrl;
const { Sider } = Layout;

const DashboardNavbar = ({ children }) => {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/logout`, {
        method: 'GET',
        credentials: 'include', // Include credentials for cookie-based authentication
      });

      if (response.ok) {
        // Clear any local data or state related to the user (if needed)
        window.location.href = '/'; // Refresh the page to reflect the logged-out state
      } else {
        console.log('Failed to log out:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <LayoutContainer>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header className="top-menu-bar">

          <div className="website-info">
            <h3>AOPE</h3>
          </div>
          <div className="signout-button">
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Log Out
            </Button>
          </div>
      
        </Layout.Header>

        <Layout>
          <Sider width={200} className="dashboard-sider">
            <Menu mode="inline" selectedKeys={[location.pathname]} className="left-navbar">
              <Menu.Item key="/dashboarda" icon={<HomeOutlined />}>
                <Link to="/dashboarda">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="/usersa" icon={<UserOutlined />}>
                <Link to="/usersa">Profile</Link>
              </Menu.Item>
              <Menu.Item key="/manage" icon={<UsergroupAddOutlined />}>
                <Link to="/manage">Manage</Link>
              </Menu.Item>
              <Menu.Item key="/view" icon={<EyeOutlined />}>
                <Link to="/view">View</Link>
              </Menu.Item>
              <Menu.Item key="/calendara" icon={<CalendarOutlined />}>
                <Link to="/calendara">Calendar</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout.Content className="c-container">{children}</Layout.Content>
        </Layout>
      </Layout>
    </LayoutContainer>
  );
};

export default DashboardNavbar;
