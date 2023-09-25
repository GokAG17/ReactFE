import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Details.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Details = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formSubmissions, setFormSubmissions] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      fetchFormSubmissions(selectedStudent.rollNo);
    } else {
      setFormSubmissions([]);
    }
  }, [selectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=student`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFormSubmissions = async (rollNumber) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/formproject/student?rollNumber=${rollNumber}&verified=true`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setFormSubmissions(data);
      } else {
        console.error('Failed to fetch form submissions:', data.error || response.statusText);
        setFormSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching form submissions:', error);
      setFormSubmissions([]);
    }
  };

  const handleStudentSelection = (e) => {
    const selectedRollNo = e.target.value;
    const selectedStudent = students.find((student) => student.rollNo === selectedRollNo);
    setSelectedStudent(selectedStudent || null);
  };

  return (
    <div className="ddt">
      <DashboardNavbar>
      <div className="ddct">
        <h2 className="student-titlet">Select a Student</h2>
        <div className="student-selector-containert">
          <select className="student-selector" onChange={handleStudentSelection}>
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.rollNo} value={student.rollNo}>
                {student.firstName} {student.lastName} - {student.rollNo}
              </option>
            ))}
          </select>
        </div>
        {selectedStudent && (
          <div className="student-details-containert">
            <h3 className="student-details-title">Student Roll No: {selectedStudent.rollNo}</h3>
            <h3 className="student-details-title">
              Student Name: {selectedStudent.firstName} {selectedStudent.lastName}
            </h3>
          </div>
        )}
        <div className="form-submissions-containert">
          <h3 className="form-submissions-title">Form Submissions:</h3>
          {formSubmissions.length > 0 ? (
            <div className="vertical-table">
              {formSubmissions.map((submission) => (
                <div key={submission.id} className="vertical-table-row">
                  <div className="vertical-table-header">Team Members</div>
                  <div className="vertical-table-data">{`${submission.teamMember1}, ${submission.teamMember2}, ${submission.teamMember3}`}</div>

                  <div className="vertical-table-header">Project Title</div>
                  <div className="vertical-table-data">{submission.projectTitle}</div>

                  <div className="vertical-table-header">Project Description</div>
                  <div className="vertical-table-data">{submission.description}</div>

                  <div className="vertical-table-header">Guide Name</div>
                  <div className="vertical-table-data">{submission.guideName}</div>

                  <div className="vertical-table-header">Guide Roll Number</div>
                  <div className="vertical-table-data">{submission.guideRollNumber}</div>

                  <div className="vertical-table-header">Guide Department</div>
                  <div className="vertical-table-data">{submission.guideDepartment}</div>

                  <div className="vertical-table-header">Guide Contact</div>
                  <div className="vertical-table-data">{submission.guideMobile}</div>

                  <div className="vertical-table-header">Guide Mail</div>
                  <div className="vertical-table-data">{submission.guideEmail}</div>
                </div>
              ))}
            </div>
          ) : (
            <p>No verified form submissions available for this student.</p>
          )}
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Details;
