import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Progress.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Progress = () => {
  const [progressData, setProgressData] = useState([]);
  const [studentRollNo, setStudentRollNo] = useState('');
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // To store selected student details
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (studentRollNo) {
      fetchProgressData();
    }
  }, [studentRollNo]);

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
        setStudentsList(data);
      } else {
        console.error('Failed to fetch students:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleStudentSelection = (selectedStudentRollNo) => {
    setStudentRollNo(selectedStudentRollNo);

    // Find the selected student from the list
    const student = studentsList.find(student => student.rollNo === selectedStudentRollNo);
    setSelectedStudent(student);
  };

  const fetchProgressData = async () => {
    try {
      if (studentRollNo) {
        const responseFormSubmission = await fetch(`${apiUrl}/api/formproject/student?rollNumber=${studentRollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response from form submission API:', responseFormSubmission);

        const responseVerification = await fetch(`${apiUrl}/api/formproject/student?rollNumber=${studentRollNo}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response from form submission API:', responseVerification);

        const responseReportSubmission = await fetch(
          `${apiUrl}/api/checklinksubmissioncompletedd?rollNo=${studentRollNo}&linkType=report`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseReportSubmission);

        const responseReportVerification = await fetch(
          `${apiUrl}/api/checklinkverified?rollNo=${studentRollNo}&linkType=report`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseReportVerification);

        const responseProjectLinkSubmission = await fetch(
          `${apiUrl}/api/checklinksubmissioncompletedd?rollNo=${studentRollNo}&linkType=drive`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseProjectLinkSubmission);

        const responseProjectLinkVerification = await fetch(
          `${apiUrl}/api/checklinkverified?rollNo=${studentRollNo}&linkType=drive`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Response from form submission API:', responseProjectLinkVerification);

        const responseGuideEvaluation = await fetch(`${apiUrl}/api/formsguideevaluationcompleted?rollNo=${studentRollNo}`, {
              credentials: 'include',
        }
        );

        console.log('Response from form submission API:',  responseGuideEvaluation);
        
        if (
          responseFormSubmission.ok &&
          responseVerification.ok &&
          responseReportSubmission.ok &&
          responseReportVerification.ok &&
          responseProjectLinkSubmission.ok &&
          responseProjectLinkVerification.ok &&
          responseGuideEvaluation.ok
        ) {
          const formSubmissionData = await responseFormSubmission.json();
          console.log('Form Submission Data:', formSubmissionData);
          const verificationData = await responseVerification.json();
          console.log('Verification Data:', verificationData);
          const reportSubmissionData = await responseReportSubmission.json();
          console.log('Verification Data:', reportSubmissionData );
          const reportVerificationData = await responseReportVerification.json();
          console.log('Verification Data:', reportVerificationData);
          const projectLinkSubmissionData = await responseProjectLinkSubmission.json();
          console.log('Verification Data:', projectLinkSubmissionData);
          const projectLinkVerificationData = await responseProjectLinkVerification.json();
          console.log('Verification Data:', projectLinkVerificationData);
          const guideEvaluationData = await responseGuideEvaluation.json();
          console.log('Verification Data:', guideEvaluationData);
  
          const progressSteps = [
            { title: 'Form Submission', completed:  formSubmissionData.length > 0 },
            { title: 'Guide Verification', completed: verificationData.length > 0 },
            { title: 'Report Link Submission', completed: reportSubmissionData.completed  },
            { title: 'Report Link Verification', completed: reportVerificationData.verified },
            { title: 'Project Link Submission', completed: projectLinkSubmissionData.completed  },
            { title: 'Project Link Verification', completed: projectLinkVerificationData.verified },
            { title: 'Guide Evaluation', completed: guideEvaluationData.completed },
          ];
  
          const totalSteps = progressSteps.length;
          const completedSteps = progressSteps.filter(step => step.completed).length;
          const calculatedOverallProgress = (completedSteps / totalSteps) * 100;

          console.log('Progress Steps:', progressSteps);
          console.log('Total Steps:', totalSteps);
          console.log('Completed Steps:', completedSteps);
          console.log('Calculated Overall Progress:', calculatedOverallProgress);
  
          setProgressData(progressSteps);
          setOverallProgress(calculatedOverallProgress);
        } else {
          console.error('Failed to fetch progress data for one or more steps.');
        }
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    }
  };

  

  return (
    <div className="progress-container">
      <DashboardNavbar>
        <div className="progress-header">
          <h2 className="progress-heading">Progress Overview</h2>
          <div className="student-selection">
            <p>Select a student:</p>
            <select onChange={(e) => handleStudentSelection(e.target.value)}>
              <option value="">Select Student</option>
              {studentsList.map((student) => (
                <option key={student.rollNo} value={student.rollNo}>
                  {student.name} - {student.rollNo}
                </option>
              ))}
            </select>
          </div>
          {selectedStudent && (
            <div className="selected-student-details">
              <h3>Selected Student:</h3>
              <p>Roll No: {selectedStudent.rollNo}</p>
            </div>
          )}
          <div className="page-description">
            <h3>Page Functionality</h3>
            <p>This page provides an overview of the progress for selected students.</p>
          </div>
        </div>
        <div className="progress-items">
          {progressData.map((item, index) => (
            <div key={index} className={`progress-item ${item.completed ? 'completed' : 'incomplete'}`}>
              <span className="progress-icon">{item.completed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-circle"></i>}</span>
              <p className="progress-title">{item.title}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.completed ? '100%' : '0%'}` }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="overall-progress">
          <div className="overall-progress-bar">
            <div className="overall-progress-fill" style={{ width: `${overallProgress}%` }}></div>
          </div>
          <p className="overall-progress-text">Overall Progress: {Math.round(overallProgress)}%</p>
        </div>
      </DashboardNavbar>
    </div>
  );
};

export default Progress;
