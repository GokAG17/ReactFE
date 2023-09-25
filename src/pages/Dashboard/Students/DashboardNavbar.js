import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  FormOutlined,
  UsergroupAddOutlined,
  CheckOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import '../CSS/DashboardNavbar.css';
import config from '../../../config';
import { LayoutContainer } from './Style';

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
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              className="left-navbar"
            >
              <Menu.Item key="/dashboards" icon={<HomeOutlined />}>
                <Link to="/dashboards">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="/users" icon={<UserOutlined />}>
                <Link to="/users">Profile</Link>
              </Menu.Item>
              <Menu.Item key="/messages" icon={<FileTextOutlined />}>
                <Link to="/messages">Report</Link>
              </Menu.Item>
              <Menu.Item key="/calendars" icon={<CalendarOutlined />}>
                <Link to="/calendars">Calendar</Link>
              </Menu.Item>
              <Menu.Item key="/forms" icon={<FormOutlined />}>
                <Link to="/forms">Form</Link>
              </Menu.Item>
              <Menu.Item key="/documents" icon={<FolderOpenOutlined />}>
                <Link to="/documents">Documents</Link>
              </Menu.Item>
              <Menu.Item key="/result" icon={<CheckOutlined />}>
                <Link to="/result">Result</Link>
              </Menu.Item>
              <Menu.Item key="/contacts" icon={<UsergroupAddOutlined />}>
                <Link to="/contacts">Contact</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout.Content className="c-container">
            {children}
          </Layout.Content>

        </Layout>
      </Layout>
    </LayoutContainer>
  );

};

export default DashboardNavbar;
