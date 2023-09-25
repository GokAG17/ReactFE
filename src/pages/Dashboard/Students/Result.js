import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Result.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Result = () => {
  const [averageTotalMarks, setAverageTotalMarks] = useState(null);
  const [firstReview, setFirstReview] = useState(null);
  const [secondReview, setSecondReview] = useState(null);
  const [thirdReview, setThirdReview] = useState(null);
  const [guideMarks, setGuideMarks] = useState(null);
  const [studentRollNo, setStudentRollNo] = useState('');

  const getCookie = (name) => {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift().trim(); // Trim whitespace
    return undefined; // Return undefined if the cookie name is not found
  };

  const fetchCurrentUser = async () => {
    try {
      // Get the rollNo cookie value
      const rollNo = getCookie('loggedIn');
      console.log('RollNo : ',rollNo);

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const currentUser = await response.json();
        setStudentRollNo(currentUser.rollNo);
      } else {
        console.error('Failed to fetch current user:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchMarks = async () => {
    try {
      if (studentRollNo) {
        const response = await fetch(`${apiUrl}/api/get-marks-by-rollno?studentRollNo=${studentRollNo}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const marksData = await response.json();
          if (marksData.totalMarks !== null) {
            setAverageTotalMarks(marksData.totalMarks);
            setFirstReview(marksData.firstReview);
            setSecondReview(marksData.secondReview);
            setThirdReview(marksData.thirdReview);
            setGuideMarks(marksData.guideMarks);
          } else {
            setAverageTotalMarks(null);
            setFirstReview(null);
            setSecondReview(null);
            setThirdReview(null);
            setGuideMarks(null);
          }
        } else {
          console.error('Failed to fetch marks:', response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [studentRollNo, averageTotalMarks]);

  console.log('averageTotalMarks:', averageTotalMarks); // Log the value of averageTotalMarks

  return (
    <div className="drsr">
      <DashboardNavbar>
      <div className="drcr">
        <h2 className="result-heading">Result</h2>
        <p className="student-rollnor">Student Roll No: {studentRollNo}</p>
        {averageTotalMarks !== null ? (
          <div className="resultr">
            <p className="review"> First Review: <span className="review-value">{firstReview}</span></p>
            <p className="review"> Second Review: <span className="review-value">{secondReview}</span></p>
            <p className="review"> Third Review: <span className="review-value">{thirdReview}</span></p>
            <p className="guide-marks"> Guide Marks: <span className="guide-marks-value">{guideMarks}</span></p>
            <p className="average-marksr"> Total Marks: <span className="total-marks-value">{averageTotalMarks.toFixed(2)}</span></p>
          </div>
        ) : (
          <p className="loadingr">Marks are not available.</p>
        )}

      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Result;
