import React, { useState } from 'react';
import DashboardNavbar from './DashboardNavbar';
import './CSS/Event.css';
import config from '../../../config';

const apiUrl = config.apiUrl;

const Event = () => {
  const [eventData, setEventData] = useState({
    title: '',
    start: '',
    end: '',
    createdBy: '',
    selectedRoles: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleRoleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setEventData({
        ...eventData,
        selectedRoles: [...eventData.selectedRoles, name],
      });
    } else {
      setEventData({
        ...eventData,
        selectedRoles: eventData.selectedRoles.filter((role) => role !== name),
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const eventDataResponse = await response.json();
        console.log('Event created:', eventDataResponse);
        // Optionally, show a success message or navigate to another page
      } else {
        console.error('Error creating event:', response.statusText);
        // Handle error
      }
    } catch (error) {
      console.error('Error creating event:', error);
      // Handle error
    }
  };

  return (
    <div className="event-container">
      <DashboardNavbar>
      <h2 className="event-title">Create Event</h2>
      <div className="event-form">
        <label className="event-label">
          Title:
          <input
            className="event-input"
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label className="event-label">
          Start Date and Time:
          <input
            className="event-input"
            type="datetime-local"
            name="start"
            value={eventData.start}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label className="event-label">
          End Date and Time:
          <input
            className="event-input"
            type="datetime-local"
            name="end"
            value={eventData.end}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label className="event-label">
          Created By:
          <input
            className="event-input"
            type="text"
            name="createdBy"
            value={eventData.createdBy}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <div className="event-roles">
          <label className="event-role-label">
            Guide:
            <input
              className="event-role-input"
              type="checkbox"
              name="guide"
              checked={eventData.selectedRoles.includes('guide')}
              onChange={handleRoleChange}
            />
          </label>
          <label className="event-role-label">
            Teacher:
            <input
              className="event-role-input"
              type="checkbox"
              name="teacher"
              checked={eventData.selectedRoles.includes('teacher')}
              onChange={handleRoleChange}
            />
          </label>
          <label className="event-role-label">
            Student:
            <input
              className="event-role-input"
              type="checkbox"
              name="student"
              checked={eventData.selectedRoles.includes('student')}
              onChange={handleRoleChange}
            />
          </label>
        </div>
        <br />
        <button className="event-button" onClick={handleCreateEvent}>
          Create Event
        </button>
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Event;
