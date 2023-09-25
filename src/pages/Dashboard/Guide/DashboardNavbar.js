import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutContainer } from './Style';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
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
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.log('Failed to log out:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { path: '/dashboardg', icon: <HomeOutlined />, text: 'Dashboard' },
    { path: '/usersg', icon: <UserOutlined />, text: 'Profile' },
    { path: '/studentg', icon: <UsergroupAddOutlined />, text: 'Students' },
    { path: '/evalg', icon: <FileTextOutlined />, text: 'Evaluation' },
    { path: '/mailg', icon: <CalendarOutlined />, text: 'Mail' },
    { path: '/eventg', icon: <ScheduleOutlined />, text: 'Event' },
    { path: '/reportg', icon: <BarChartOutlined />, text: 'Report' },
    { path: '/calendarg', icon: <CalendarOutlined />, text: 'Calendar' },
  ];

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
              {navLinks.map((link, index) => (
                <Menu.Item key={link.path} icon={link.icon}>
                  <Link to={link.path}>{link.text}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
          <Layout.Content className="c-container">{children}</Layout.Content>
        </Layout>
      </Layout>
    </LayoutContainer>
  );
};

export default DashboardNavbar;
