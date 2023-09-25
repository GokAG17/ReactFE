import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Document.css';
import { getCookie } from './cookie';
import config from '../../../config';

const apiURL = config.apiUrl;

const Documents = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentUser, setCurrentUser] = useState(null);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState(null);
  const [verifiedLink, setVerifiedLink] = useState('');

  useEffect(() => {
    // Fetch user and student data
    const fetchUserData = async () => {
      try {
        const rollNo = getCookie('loggedIn');
        
        const response = await fetch(`${apiURL}/api/currentuser?rollNo=${rollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
          fetchStudents(data.rollNo);
        } else if (response.status === 401) {
          console.log('Unauthorized. Please log in again.');
        } else {
          console.error('Failed to fetch current user:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchStudents = async (guideRollNo) => {
      try {
        const apiUrl = `${apiURL}/api/formproject/guide?guideRollNumber=${guideRollNo}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else if (response.status === 401) {
          console.log('Unauthorized. Please log in again.');
        } else {
          console.error('Failed to fetch students:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleStudentSelect = (e) => {
    setSelectedStudent(e.target.value);
    setSelectedLinkType('');
    setSubmissionInfo(null);
    setVerifiedLink('');
  };

  const handleLinkTypeSelect = (e) => {
    setSelectedLinkType(e.target.value);
    setSubmissionInfo(null);
    setVerifiedLink('');
    fetchSubmissionInfo(selectedStudent, e.target.value);
  };

  const fetchSubmissionInfo = async (studentRollNo, linkType) => {
    try {
      const apiUrl = `${apiURL}/api/submitlink?rollNo=${studentRollNo}&linkType=${linkType}`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissionInfo(data);
      } else if (response.status === 401) {
        console.log('Unauthorized. Please log in again.');
      } else {
        console.error('Failed to fetch submission info:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching submission info:', error);
    }
  };

  const handleVerifyLink = async (link) => {
    try {
      // Send a POST request to the server to verify the link
      const response = await fetch(`${apiURL}/api/verifylink`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          link: link,
        }),
      });
  
      if (response.ok) {
        // Mark the link as verified on the client-side
        setVerifiedLink(link);
      } else {
        console.error('Link verification failed:', response.status, response.statusText);
        // Handle error, display a message, or take appropriate action
      }
    } catch (error) {
      console.error('Error verifying link:', error);
      // Handle error, display a message, or take appropriate action
    }
  };
  

  return (
    <div className="dr">
      <DashboardNavbar>
      <div className="drc">
        <h2>Student Submissions</h2>
        {loading ? (
          <p>Loading student submissions...</p>
        ) : (
          <div>
            <div className="student-selectg">
              <label htmlFor="studentSelect">Select a student:</label>
              <select
                id="studentSelect"
                value={selectedStudent}
                onChange={handleStudentSelect}
              >
                <option value="">All Students</option>
                {students.map((student, index) => (
                  <option key={index} value={student.rollNumber}>
                    {student.studentName} ({student.rollNumber})
                  </option>
                ))}
              </select>
            </div>
            {selectedStudent && (
              <div className="link-type-selectg">
                <label htmlFor="linkTypeSelect">Select a link type:</label>
                <select
                  id="linkTypeSelect"
                  value={selectedLinkType}
                  onChange={handleLinkTypeSelect}
                >
                  <option value="">Select Link Type</option>
                  <option value="report">Report Link</option>
                  <option value="drive">Drive Link</option>
                </select>
              </div>
            )}
            {submissionInfo ? (
              <div className="submission-infog">
                <p>Student Name: {submissionInfo.studentName}</p>
                <p>Link Type: {submissionInfo.linkType}</p>
                <p>Link: {submissionInfo.link}</p>
                <button
                  className="view-link-btng"
                  onClick={() => window.open(submissionInfo.link, '_blank')}
                >
                  View Link
                </button>
                <button
                  className="verify-link-btng"
                  onClick={() => handleVerifyLink(submissionInfo.link)}
                  disabled={verifiedLink === submissionInfo.link}
                >
                  Verify Link
                </button>
                {verifiedLink === submissionInfo.link && (
                  <p className="verified-link-msgg">Link verified successfully!</p>
                )}
              </div>
            ) : (
              <p>Student not submitted.</p>
            )}
          </div>
        )}
      </div>
      </DashboardNavbar>
    </div>
  );
};


export default Documents;
