import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Analytics.css';
import { Bar } from 'react-chartjs-2';
import config from '../../../config';

const apiUrl = config.apiUrl;


const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [marks, setMarks] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/accounts?role=student`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchMarks = async (studentRollNo) => {
    console.log('Selected student roll number:', studentRollNo);
    try {
      const response = await fetch(`${apiUrl}/api/get-marks-by-rollno?studentRollNo=${studentRollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      console.log('Fetched marks data:', data);
      setMarks(data);
    } catch (error) {
      console.error('Error fetching marks:', error);
      setMarks({}); // Set marks to an empty object on error
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const calculateOverallPerformance = () => {
    const totalMarks = Object.values(marks).reduce((sum, mark) => sum + mark, 0);
    const totalSubjects = Object.keys(marks).length;
    return totalMarks / totalSubjects;
  };

  const chartData = {
    labels: Object.keys(marks),
    datasets: [
      {
        label: 'Marks',
        data: Object.values(marks),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const handleStudentSelection = (e) => {
    setSelectedStudent(e.target.value);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="analytics-container">
      <DashboardNavbar>
      <div className="analytics-content">
        <h2 className="analytics-heading">Student Marks Analytics</h2>

        <div className="select-student">
          <select
            id="studentSelection"
            value={selectedStudent}
            onChange={handleStudentSelection}
          >
            <option value="">Select...</option>
            {students.map((student) => (
              <option key={student.rollNo} value={student.rollNo}>
                {student.rollNo}
              </option>
            ))}
          </select>

          <button onClick={() => fetchMarks(selectedStudent)}>Fetch Marks</button>
        </div>

        <div className="marks-list">
          <h3 className="marks-heading">Marks of Student:</h3>
          <table className="marks-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(marks).map((subject, index) => (
                <tr key={index}>
                  <td>{subject}</td>
                  <td>{marks[subject] !== null ? marks[subject] : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="toggle-analytics">
          <button onClick={toggleAnalytics}>Toggle Analytics</button>
        </div>

        {showAnalytics && (
          <div className="analytics">
            <h3 className="analytics-heading">Analytics based on student marks</h3>
            <div className="chart-container">
              <Bar data={chartData} options={{ responsive: true }} />
            </div>
          </div>
        )}

        {selectedStudent && (
          <div className="overall-performance">
            <h3>Overall Performance</h3>
            <p>{`Overall Performance of ${selectedStudent}: ${calculateOverallPerformance()}`}</p>
          </div>
        )}
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Analytics;
