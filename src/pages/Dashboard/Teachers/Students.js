import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal } from 'antd';
import { MailOutlined, EyeOutlined } from '@ant-design/icons'; // Import Ant Design icons
import DashboardNavbar from './DashboardNavbar';
import './CSS/Student.css';
import Progress from './Progress'; // Import the Progress component
import config from '../../../config';

const apiUrl = config.apiUrl;

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const studentsWithFullName = data.map(student => ({
          ...student,
          firstNameLastName: `${student.firstName} ${student.lastName}`,
          guideName: 'Not Enrolled', // Initialize an empty guide name field
        }));
        setStudents(studentsWithFullName);

        // Fetch guide names for each student
        fetchGuideNames(studentsWithFullName);
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGuideNames = async (studentsData) => {
    // Make API calls to fetch guide names for each student and update the state
    const updatedStudents = await Promise.all(
      studentsData.map(async (student) => {
        try {
          const response = await fetch(`${apiUrl}/api/formproject/student-guide?rollNumber=${student.rollNo}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const guideData = await response.json();
            const guideName = guideData.guideName; // Assuming the API response structure
            return {
              ...student,
              guideName,
            };
          } else {
            console.error('Failed to fetch guide name for student:', student.rollNo);
            return student;
          }
        } catch (error) {
          console.error('Error fetching guide name for student:', student.rollNo, error);
          return student;
        }
      })
    );

    setStudents(updatedStudents);
  };

  const handleMailTo = (email) => {
    const mailtoLink = `mailto:${email}`;
    window.location.href = mailtoLink;
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsViewModalVisible(true);
  };

  const columns = [
    {
      title: 'Roll No',
      dataIndex: 'rollNo',
      key: 'rollNo',
    },
    {
      title: 'Name',
      dataIndex: 'firstNameLastName',
      key: 'firstNameLastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Guide Name',
      dataIndex: 'guideName', // Use the guideName field from the state
      key: 'guideName',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<MailOutlined />} // Use Ant Design Mail icon
            onClick={() => handleMailTo(record.email)}
          >
            Mail
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />} // Use Ant Design Eye icon
            onClick={() => handleViewStudent(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="dts">
      <DashboardNavbar>
        <div className="dtcs">
          <h2>Students</h2>
          <Table dataSource={students} columns={columns} />
          <Modal
            title={`Student Details - ${selectedStudent?.firstNameLastName}`}
            visible={isViewModalVisible}
            onCancel={() => setIsViewModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                Close
              </Button>,
            ]}
          >
            {selectedStudent && (
              <>
                <p><strong>Roll No:</strong> {selectedStudent?.rollNo}</p>
                <p><strong>Name:</strong> {selectedStudent?.firstNameLastName}</p>
                <p><strong>Email:</strong> {selectedStudent?.email}</p>
                <p><strong>Guide Name:</strong> {selectedStudent?.guideName}</p>
                <Progress studentRollNo={selectedStudent.rollNo} /> 
              </>
            )}
          </Modal>
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Students;
