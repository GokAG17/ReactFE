import React, { useState, useEffect, useCallback } from 'react';
import DashboardNavbar from './DashboardNavbar';
import 'react-toastify/dist/ReactToastify.css';
import './CSS/User.css';
import config from '../../../config';
import {
  Input,
  Button,
  Card,
  Spin,
  Form,
  Space,
  Typography,
  Row,
  Col,
  Avatar,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CloseOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { getCookie } from './cookie';

const apiUrl = config.apiUrl;
const { Meta } = Card;
const { Title } = Typography;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = useCallback(async () => {
    try {
      console.log("Fetching user data...");
      const rollNo = getCookie('loggedIn');

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        console.log("User data fetched successfully.");
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUsers([data]);
        setLoading(false);
        setEditedUser(data);
      } else {
        console.log('Failed to fetch user data:', response.status, response.statusText);
        setError('Failed to fetch user data');
        setUsers([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('An error occurred while fetching user data');
      setUsers([]);
      setLoading(false);
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/updateuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedUser),
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
  
        setEditMode(false); // Exit edit mode after saving
  
        // Reload the page
        window.location.reload();
      } else {
        console.log('Failed to update user data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    // Reset the edited user to the original user data
    setEditedUser(users[0]);
    setEditMode(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const labelColProps = {
    style: {
      fontSize: '24px', // Increase font size for labels
      fontWeight: 'bold', // Make labels bolder
    },
  };

  const valueColProps = {
    style: {
      fontSize: '24px', // Increase font size for values
      marginBottom: '12px',
    },
  };

  return (
    <div className="us">
      <DashboardNavbar>
        <div className="us1">
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
            </div>
          ) : error ? (
            <h2>Error: {error}</h2>
          ) : (
            <div className="profile-container">
              {users.map((user, index) => (
                <Card key={index} className="profile-card">
                  <Meta
                    avatar={<Avatar size={64} icon={<UserOutlined />} />}
                    title={<Title level={4}>User Profile</Title>}
                    description={
                      <Form form={form} onFinish={saveChanges} layout="vertical">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              label="First Name"
                              name="firstName"
                              initialValue={user.firstName}
                              labelCol={labelColProps}
                            >
                              {editMode ? (
                                <Input name="firstName" onChange={handleInputChange} />
                              ) : (
                                <Col {...valueColProps}>{user.firstName}</Col>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              label="Last Name"
                              name="lastName"
                              initialValue={user.lastName}
                              labelCol={labelColProps}
                            >
                              {editMode ? (
                                <Input name="lastName" onChange={handleInputChange} />
                              ) : (
                                <Col {...valueColProps}>{user.lastName}</Col>
                              )}
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item
                          label="Roll No"
                          name="rollNo"
                          initialValue={user.rollNo}
                          labelCol={labelColProps}
                        >
                          {editMode ? (
                            <Input name="rollNo" onChange={handleInputChange} />
                          ) : (
                            <Col {...valueColProps}>{user.rollNo}</Col>
                          )}
                        </Form.Item>
                        <Form.Item label="Email" labelCol={labelColProps}>
                          <Col {...valueColProps}>{user.email}</Col>
                        </Form.Item>
                        <Form.Item
                          label="Phone Number"
                          name="phoneNumber"
                          initialValue={user.phoneNumber}
                          labelCol={labelColProps}
                        >
                          {editMode ? (
                            <Input name="phoneNumber" onChange={handleInputChange} />
                          ) : (
                            <Col {...valueColProps}>{user.phoneNumber}</Col>
                          )}
                        </Form.Item>
                        <Form.Item label="Role" labelCol={labelColProps}>
                          <Col {...valueColProps}>{user.role}</Col>
                        </Form.Item>
                        <Form.Item label="University" labelCol={labelColProps}>
                          <Col {...valueColProps}>{user.university}</Col>
                        </Form.Item>
                        <Form.Item
                          label="Department"
                          name="department"
                          initialValue={user.department}
                          labelCol={labelColProps}
                        >
                          {editMode ? (
                            <Input name="department" onChange={handleInputChange} />
                          ) : (
                            <Col {...valueColProps}>{user.department}</Col>
                          )}
                        </Form.Item>
                        <Form.Item>
                          {editMode ? (
                            <Space>
                              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                                Save
                              </Button>
                              <Button icon={<CloseOutlined />} onClick={handleCancelClick}>
                                Cancel
                              </Button>
                            </Space>
                          ) : (
                            <Button type="primary" icon={<EditOutlined />} onClick={handleEditClick}>
                              Edit
                            </Button>
                          )}
                        </Form.Item>
                      </Form>
                    }
                  />
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Users;
