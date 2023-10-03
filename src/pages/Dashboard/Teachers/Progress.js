import React, { useState, useEffect } from 'react';
import { Progress as AntProgress, Card } from 'antd';
import 'antd/dist/antd';
import './CSS/Progress.css'; 
import config from '../../../config';

const { Meta } = Card;
const apiUrl = config.apiUrl;

const Progress = ({ studentRollNo }) => {
  const [progressData, setProgressData] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchStudentData();
  }, [studentRollNo]);

  const fetchStudentData = async () => {
    try {
      if (studentRollNo) {
        const response = await fetch(`${apiUrl}/api/accounts?role=Student`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          const student = data.find((student) => student.rollNo === studentRollNo);
          setSelectedStudent(student);

          fetchProgressData(student);
        } else {
          console.error('Failed to fetch students:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  const fetchProgressData = async (student) => {
    try {
      if (student) {
        const responseFormSubmission = await fetch(
          `${apiUrl}/api/formproject/student?rollNumber=${student.rollNo}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

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
      <div className="progress-header">
        <h4 className="progress-heading">Progress Overview</h4>
      </div>
      <div className="progress-items">
        {progressData.map((item, index) => (
          <div key={index} className={`progress-item ${item.completed ? 'completed' : 'incomplete'}`}>
            <AntProgress
              type="circle"
              percent={item.completed ? 100 : 0}
              width={60}
              format={() => (item.completed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-circle"></i>)}
            />
            <p className="progress-title">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="overall-progress">
        <h3>Overall Progress</h3>
        <AntProgress percent={Math.round(overallProgress)} type="circle" width={250} />
      </div>
    </div>
  );
};

export default Progress;