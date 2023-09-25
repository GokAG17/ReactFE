import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import "./CSS/Document.css";
import config from '../../../config';

const apiUrl = config.apiUrl;

const Documents = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedLinkType, setSelectedLinkType] = useState('');
  const [verifiedLinks, setVerifiedLinks] = useState([]);

  useEffect(() => {
    // Fetch all students
    fetchStudents();
  }, []);

  useEffect(() => {
    // Fetch verified links for the selected student and link type
    if (selectedStudent && selectedLinkType) {
      fetchVerifiedLinks(selectedStudent, selectedLinkType);
    } else {
      setVerifiedLinks([]);
    }
  }, [selectedStudent, selectedLinkType]);

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
        console.log('Fetched students:', data);
      } else {
        console.error('Failed to fetch students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchVerifiedLinks = async (rollNumber, linkType) => {
    try {
      console.log("Fetching verified links for:", rollNumber, linkType);
      const response = await fetch(
        `${apiUrl}/api/verifiedlinksubmissions?rollNo=${rollNumber}&linkType=${linkType}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        setVerifiedLinks(data);
        console.log('Fetched verified links:', data);
      } else {
        console.error('Failed to fetch verified links:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching verified links:', error);
    }
  };

  return (
    <div className="dott">
      <DashboardNavbar>
      <div className="doct">
        <h2>Student Submissions</h2>
        <div className="student-selectot">
          <label htmlFor="studentSelect">Select a student:</label>
          <select
            id="studentSelect"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.rollNo} value={student.rollNo}>
                 {student.firstName} {student.lastName} ({student.rollNo})
              </option>
            ))}
          </select>
        </div>
        {selectedStudent && (
          <div>
            <div className="link-type-selectot">
              <label htmlFor="linkTypeSelect">Select a link type:</label>
              <select
                id="linkTypeSelect"
                value={selectedLinkType}
                onChange={(e) => setSelectedLinkType(e.target.value)}
              >
                <option value="">Select Link Type</option>
                <option value="report">Report Link</option>
                <option value="drive">Drive Link</option>
                {/* Add other link types as needed */}
              </select>
            </div>
            <h3>Verified Links for {selectedStudent}</h3>
            {verifiedLinks.length > 0 ? (
              <ul>
                {verifiedLinks.map((link, index) => (
                  <li key={index}>
                    {link.linkType}: {link.link}
                    <button className="view-link-button">
                      <a href={link.link} target="_blank" rel="noopener noreferrer">
                        View Link
                      </a>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No verified links found for {selectedStudent}</p>
            )}
          </div>
        )}
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Documents;
