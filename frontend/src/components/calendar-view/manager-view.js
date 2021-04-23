import { Modal, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import { getDays } from './utils';
import './styles/calendar.css';
import './styles/manager.css';
import { ManagerControls } from './cards';
const ManagerView = () => {
  const days = getDays(new Date());

  const employees = ['Nick', 'Logan', 'Caesar', 'Blake', 'Elias', 'Kirubel', 'Seun', 'Tim'];
  const rooms = [1, 2, 3, 4, 5];

  const [events, setEvents] = useState([]);

  const [isScheduleShowing, setIsScheduleShowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleOpenSchedule = (date) => {
    setSelectedDate(date);
    setIsScheduleShowing(true);
  };
  const handleCloseSchedule = () => setIsScheduleShowing(false);

  const handleReserve = (day, room, employee) => {
    setEvents([...events, { day, room, employee }]);
    //TODO: send to API
    handleCloseSchedule();
  };

  return (
    <div className="container mt-5">
      <div className="calendar shadow bg-white p-5">
        <div className="d-flex align-items-center">
          <h2 className="month font-weight-bold mb-0 text-uppercase">April 2021</h2>
          <Form>
            <Form.Group controlId="calendar.selectMonth">
              <Form.Label>Month</Form.Label>
              <Form.Control as="select">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
        <p className="font-italic text-muted mb-5">No events today.</p>
        <ol className="day-names list-unstyled mb-0">
          <li className="font-weight-bold text-uppercase">Sun</li>
          <li className="font-weight-bold text-uppercase">Mon</li>
          <li className="font-weight-bold text-uppercase">Tue</li>
          <li className="font-weight-bold text-uppercase">Wed</li>
          <li className="font-weight-bold text-uppercase">Thu</li>
          <li className="font-weight-bold text-uppercase">Fri</li>
          <li className="font-weight-bold text-uppercase">Sat</li>
        </ol>

        <ol className="days list-unstyled">
          {days.map((day) => {
            return (
              <li key={day} onClick={() => handleOpenSchedule(day)}>
                <div className="date">{day.getDate()}</div>
                <Events day={day} events={events} />
              </li>
            );
          })}
        </ol>
      </div>
      <ManagerControls employees={employees} rooms={rooms} events={events} />
      <ScheduleModal
        show={isScheduleShowing}
        handleClose={handleCloseSchedule}
        date={selectedDate}
        handleReserve={handleReserve}
        employees={employees}
        rooms={rooms}
      />
    </div>
  );
};

const Events = ({ day, events }) => {
  const todaysEvents = [];
  events.forEach((event) => {
    if (event.day.getDate() === day.getDate() && event.day.getMonth() === day.getMonth()) {
      todaysEvents.push(event);
    }
  });

  if (todaysEvents.length <= 2) {
    return (
      <div>
        {todaysEvents.map((ev, idx) => {
          return (
            <div className="event bg-primary" key={idx}>
              Room {ev.room} - {ev.employee}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      <div className="event bg-primary">
        Room {todaysEvents[0].room} - {todaysEvents[0].employee}
      </div>
      <div className="event bg-primary">And {todaysEvents.length} others</div>
    </div>
  );
};

const ScheduleModal = (props) => {
  const rooms = [...props.rooms];
  const employees = [...props.employees];

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule an Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Selected Date: {props.date.toDateString()}</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Room Number</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedRoom(e.target.value)}>
              {rooms.map((room) => (
                <option key={room}>{room}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="scheduleForm.employee">
            <Form.Label>Employee</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedEmployee(e.target.value)}>
              {employees.map((employee) => (
                <option key={employee}>{employee}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          onClick={() => props.handleReserve(props.date, selectedRoom, selectedEmployee)}
        >
          Reserve
        </button>
        <button className="btn btn-danger" onClick={props.handleClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManagerView;
