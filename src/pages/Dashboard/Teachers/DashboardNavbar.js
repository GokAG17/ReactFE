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
  FileDoneOutlined,
  LineChartOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
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
              <Menu.Item key="/dashboardt" icon={<HomeOutlined />}>
                <Link to="/dashboardt">Dashboard</Link>
              </Menu.Item>
              <Menu.Item key="/userst" icon={<UserOutlined />}>
                <Link to="/userst">Profile</Link>
              </Menu.Item>
              <Menu.Item key="/studentst" icon={<FileTextOutlined />}>
                <Link to="/studentst">Students</Link>
              </Menu.Item>
              <Menu.Item key="/formt" icon={<FormOutlined />}>
                <Link to="/formt">Form</Link>
              </Menu.Item>
              <Menu.Item key="/evaluationt" icon={<FolderOpenOutlined />}>
                <Link to="/evaluationt">Evaluation</Link>
              </Menu.Item>
              <Menu.Item key="/event" icon={<ScheduleOutlined />}>
                <Link to="/event">Event</Link>
              </Menu.Item>
              <Menu.Item key="/calendart" icon={<CalendarOutlined />}>
                <Link to="/calendart">Calendar</Link>
              </Menu.Item>
              <Menu.Item key="/resultst" icon={<FileDoneOutlined />}>
                <Link to="/resultst">Result</Link>
              </Menu.Item>
              <Menu.Item key="/documentst" icon={<InfoCircleOutlined />}>
                <Link to="/documentst">Details</Link>
              </Menu.Item>
              <Menu.Item key="/progresst" icon={<LineChartOutlined />}>
                <Link to="/progresst">Progress</Link>
              </Menu.Item>
              <Menu.Item key="/analyticst" icon={<BarChartOutlined />}>
                <Link to="/analyticst">Analytics</Link>
              </Menu.Item>
              <Menu.Item key="/messagest" icon={<InfoCircleOutlined />}>
                <Link to="/messagest">Details</Link>
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
