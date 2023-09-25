import React, { useState, useEffect } from 'react';
import { Table, Button, Space } from 'antd';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Student.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=student`, {
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
          <Button type="primary" onClick={() => handleMailTo(record.email)}>Mail</Button>
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
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Students;
