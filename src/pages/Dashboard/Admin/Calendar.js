import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CSS/Calendar.css';
import moment from 'moment';
import config from '../../../config';

const apiUrl = config.apiUrl;

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Inside the fetchEvents function
  const fetchEvents = () => {

    fetch(`${apiUrl}/api/events`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials:'include',
    })
      .then(response => response.json())
      .then(data => {
        // Convert date-time strings to Date objects with correct time zone offset
        const eventsWithDateObjects = data.map(event => ({
          ...event,
          start: new Date(event.start), // Use the original fetched timestamp
          end: new Date(event.end),     // Use the original fetched timestamp
        }));
        setEvents(eventsWithDateObjects);
      })
      .catch(error => console.error('Error fetching events:', error));
  };

  return (
    <div className="calendar-page">
      <DashboardNavbar>
      <div className="calendar-header">
        <h2 className="calendar-title">Calendar</h2>
      </div>
      <div className="full-calendar-container">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          style={{ height: 500, width: '95%' }}
          selectable
          resizable
          formats={{
            eventTimeRangeFormat: ({ start, end }, culture, local) =>
              `${local.format(start, 'YYYY-MM-DD h:mm A', culture)} - ${local.format(end, 'YYYY-MM-DD h:mm A', culture)}`,
          }}
          
        />
      </div>
      </DashboardNavbar>
    </div>
  );
};

export default Calendar;
