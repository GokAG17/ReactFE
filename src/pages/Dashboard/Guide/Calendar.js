import React, { useState, useEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CSS/Calendar.css';
import moment from 'moment';
import { getCookie } from './cookie';
import config from '../../../config';

const apiUrl = config.apiUrl;

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // New state to track the selected event

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
  }, []);

  const fetchCurrentUser = async () => {
    try {

      const rollNo = getCookie('loggedIn');

      const response = await fetch(`${apiUrl}/api/currentuser?rollNo=${rollNo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      } else {
        console.log('Failed to fetch user data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  // Inside the fetchEvents function
const fetchEvents = () => {

  fetch(`${apiUrl}/api/events`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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

  const handleEventClick = (event) => {
    if (
      currentUser &&
      (currentUser.role === 'Guide' || currentUser.role === 'teacher')
    ) {
      setSelectedEvent(event); // Set the selected event when it is clicked
    }
  };

  const handleDeleteEvent = (eventId) => {
  
    fetch(`${apiUrl}/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(response => {
        if (response.ok) {
          setEvents(events.filter(e => e.id !== eventId));
          setSelectedEvent(null); // Clear the selected event
        } else {
          console.error('Error deleting event:', response.status, response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };
  
  const handleEventResize = (eventResizeInfo) => {
    if (currentUser && (currentUser.role === 'Guide' || currentUser.role === 'teacher')) {
      const eventToUpdate = {
        id: eventResizeInfo.event.id,
        start: eventResizeInfo.start,
        end: eventResizeInfo.end,
      };
  
      fetch(`${apiUrl}/api/events/${eventToUpdate.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventToUpdate),
      })
        .then(response => {
          if (response.ok) {
            // Update the events in your state with the resized event
            setEvents(events.map(e => (e.id === eventToUpdate.id ? eventToUpdate : e)));
          } else {
            console.error('Error updating event:', response.status, response.statusText);
          }
        })
        .catch(error => console.error('Error updating event:', error));
    }
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
          onSelectEvent={handleEventClick}
          onEventResize={handleEventResize}
        />
      </div>

      {selectedEvent && (
        <div className="event-options">
          <button onClick={() => setSelectedEvent(null)}>Close</button>
          <button onClick={() => handleDeleteEvent(selectedEvent.id)}>
            Delete Event
          </button>
        </div>
      )}
      </DashboardNavbar>
    </div>
  );
};

export default Calendar;