import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Dashboard.css';
import config from '../../../config';

const apiURL = config.apiUrl;

const Dashboard = () => {
  const [circulars, setCirculars] = useState([]);
  const [messages, setMessages] = useState([]);
  const [pdfViewUrl, setPdfViewUrl] = useState('');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      
      // Fetch circulars
      const circularsResponse = await fetch(`${apiURL}/admin/circulars`, {
        credentials: 'include',
      });
      const circularsData = await circularsResponse.json();
      const studentCirculars = circularsData.filter(circular => circular.recipients.includes('students'));

      // Fetch messages
      const messagesResponse = await fetch(`${apiURL}/admin/messages`, {
        credentials: 'include',
      });
      const messagesData = await messagesResponse.json();
      const studentMessages = messagesData.filter(message => message.recipients.includes('students'));

      setCirculars(studentCirculars);
      setMessages(studentMessages);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewPdf = async (pdfUrl) => {
    try {

      const fullPdfUrl = `${apiURL}/${pdfUrl}`;

      const response = await fetch(fullPdfUrl, {

        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        setSelectedPdfUrl(pdfUrl);
        setPdfViewUrl(blobUrl);
        setShowPdfViewer(true);
      } else {
        console.error('Error fetching PDF:', response.status);
      }
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  };

  const handleClosePdfViewer = () => {
    setPdfViewUrl('');
    setSelectedPdfUrl('');
    setShowPdfViewer(false);
  };

  return (
    <div className="d">
      <DashboardNavbar>
      <div className="dc">
        <div className="cd">
          <div className="ce">
            <div className="dashboard-welcome">
              <p className="welcome-text">Welcome to the Academic Operations and Evaluation (AOPE) Dashboard!</p>
              <p className="dashboard-instructions">
                This platform is designed to streamline various academic processes and provide essential tools for students and staff.
                Below are instructions to help you navigate and utilize the features effectively:
              </p>
              <ul className="instruction-list">
                <li>
                  <span className="instruction-icon">📢</span>
                  Stay updated with announcements and notifications provided within the dashboard for any changes or important information.
                </li>
              </ul>
            </div>

            <div className="circulars">
              <h3>Circulars:</h3>
              {circulars.map((circular) => (
                <div key={circular.id} className="circular">
                  <i className="fas fa-file-alt circular-icon colored-icon"></i>
                  <div className="circular-info">
                    <h4>{circular.title}</h4>
                    <p>{circular.content}</p>
                    <p>Recipients: {circular.recipients ? circular.recipients.join(', ') : 'None'}</p>
                    {circular.pdfUrl && (
                      <div className="pdf-delete-buttons">
                        <button onClick={() => {
                          handleViewPdf(circular.pdfUrl);
                        }} className="pdf-button">View PDF</button>
                        {showPdfViewer && selectedPdfUrl === circular.pdfUrl && (
                          <div className="pdf-viewer">
                            <iframe
                              src={pdfViewUrl}
                              title={`Circular PDF: ${circular.title}`}
                              width="900px"
                              height="600px"
                            ></iframe>
                            <button onClick={handleClosePdfViewer} className="pdf-button">Close PDF</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="messages">
              <h3>Messages:</h3>
              {messages.map((message) => (
                <div key={message.id} className="message">
                  <i className="fas fa-envelope message-icon colored-icon"></i>
                  <div className="message-info">
                    <h4>{message.title}</h4>
                    <p>{message.content}</p>
                    <p>Recipients: {message.recipients ? message.recipients.join(', ') : 'None'}</p>
                    {message.pdfUrl && (
                      <div className="pdf-delete-buttons">
                        <button onClick={() => {
                          handleViewPdf(message.pdfUrl);
                        }} className="pdf-button">View PDF</button>
                        {showPdfViewer && selectedPdfUrl === message.pdfUrl && (
                          <div className="pdf-viewer">
                            <iframe
                              src={pdfViewUrl}
                              title={`Message PDF: ${message.title}`}
                              width="900px"
                              height="600px"
                            ></iframe>
                            <button onClick={handleClosePdfViewer} className="pdf-button">Close PDF</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Dashboard;
