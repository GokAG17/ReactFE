import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Forms.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Forms = () => {
  const [studentName, setStudentName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [teamMember1, setTeamMember1] = useState('');
  const [teamMember2, setTeamMember2] = useState(null);
  const [teamMember3, setTeamMember3] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [guideName, setGuideName] = useState('');
  const [guideDepartment, setGuideDepartment] = useState('');
  const [guideMobile, setGuideMobile] = useState('');
  const [guideEmail, setGuideEmail] = useState('');
  const [guideRollNumber, setGuideRollNo] = useState(''); // Added guideRollNo state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      

      const response = await fetch(`${apiUrl}/api/formproject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({
          studentName,
          rollNumber,
          teamMember1,
          teamMember2,
          teamMember3,
          projectTitle,
          description,
          guideName,
          guideDepartment,
          guideMobile,
          guideEmail,
          guideRollNumber, // Include guideRollNo in the request body
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStudentName('');
        setRollNumber('');
        setTeamMember1('');
        setTeamMember2(null);
        setTeamMember3(null);
        setProjectTitle('');
        setDescription('');
        setGuideName('');
        setGuideDepartment('');
        setGuideMobile('');
        setGuideEmail('');
        setGuideRollNo(''); // Reset guideRollNo field

        toast.success('Form submitted successfully');
      } else {
        console.error('Project submission failed:', data.error);
        toast.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error('Error submitting form');
    }
  };

  return (
    <div className="df">
      <DashboardNavbar >
      <div className="dfc">
        <div className="logo-containers">
          
        </div>
        <h2>Project Submission Form</h2>
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-groups">
            <label htmlFor="studentName">Student Name:</label>
            <input
              type="text"
              id="studentName"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="rollNumber">Roll Number:</label>
            <input
              type="text"
              id="rollNumber"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="teamMember1">Team Member 1:</label>
            <input
              type="text"
              id="teamMember1"
              value={teamMember1}
              onChange={(e) => setTeamMember1(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="teamMember2">Team Member 2:</label>
            <input
              type="text"
              id="teamMember2"
              value={teamMember2 || ''}
              onChange={(e) => setTeamMember2(e.target.value || null)}
            />
          </div>
          <div className="form-groups">
            <label htmlFor="teamMember3">Team Member 3:</label>
            <input
              type="text"
              id="teamMember3"
              value={teamMember3 || ''}
              onChange={(e) => setTeamMember3(e.target.value || null)}
            />
          </div>
          <div className="form-groups">
            <label htmlFor="projectTitle">Project Title:</label>
            <input
              type="text"
              id="projectTitle"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="guideName">Guide Name:</label>
            <input
              type="text"
              id="guideName"
              value={guideName}
              onChange={(e) => setGuideName(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="guideDepartment">Guide Department:</label>
            <input
              type="text"
              id="guideDepartment"
              value={guideDepartment}
              onChange={(e) => setGuideDepartment(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="guideMobile">Guide Mobile Number:</label>
            <input
              type="text"
              id="guideMobile"
              value={guideMobile}
              onChange={(e) => setGuideMobile(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="guideEmail">Guide Email:</label>
            <input
              type="email"
              id="guideEmail"
              value={guideEmail}
              onChange={(e) => setGuideEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-groups">
            <label htmlFor="guideRollNo">Guide Roll Number:</label>
            <input
              type="text"
              id="guideRollNo"
              value={guideRollNumber}
              onChange={(e) => setGuideRollNo(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btns">Submit</button>
        </form>
      </div>
      <ToastContainer />
      </DashboardNavbar>
    </div>
  );
};

export default Forms;
