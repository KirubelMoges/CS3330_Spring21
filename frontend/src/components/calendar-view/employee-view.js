import './styles/employee.css';
import './styles/calendar.css';
import React, { useEffect, useState } from 'react';
import { getDays } from './utils';
import { RoomCard, TimeCard } from './cards';
import { Modal, Form } from 'react-bootstrap';

const EmployeeView = () => {
  const [days, setDays] = useState(getDays(new Date()));
  const rooms = [1, 2, 3, 4, 5];

  const [month, setMonth] = useState();
  const [year, setYear] = useState();

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    if (!month || !year) {
      setMonth(days[Math.floor(days.length / 2)].getMonth() + 1);
      setYear(days[0].getFullYear() + 1);
    }
  }, [month, setMonth, year, setYear, days]);

  const [isScheduleShowing, setIsScheduleShowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleOpenSchedule = (date) => {
    setSelectedDate(date);
    setIsScheduleShowing(true);
  };
  const handleCloseSchedule = () => setIsScheduleShowing(false);

  const handleReserve = (day, room) => {
    console.log(day, room);
    handleCloseSchedule();
  };

  const sendMonthChangeRequest = () => {};

  return (
    <div className="container pb-5">
      <div className="calendar shadow bg-white p-5">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="month font-weight-bold mb-0 text-uppercase">April 2021</h2>
          <Form>
            <Form.Group controlId="calendar.selectMonth">
              <Form.Label>Month</Form.Label>
              <Form.Control as="select" onChange={(e) => setMonth(e.target.value)} value={month}>
                {months.map((month, index) => (
                  <option key={index}>{month}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="calendar.selectYear">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <button className="btn btn-primary" onClick={() => sendMonthChangeRequest()}>
              Change Month
            </button>
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
              </li>
            );
          })}
        </ol>
      </div>
      <TimeCard />
      <RoomCard />
      <ScheduleModal
        show={isScheduleShowing}
        handleClose={handleCloseSchedule}
        date={selectedDate}
        handleReserve={handleReserve}
        rooms={rooms}
      />
    </div>
  );
};

const ScheduleModal = (props) => {
  const rooms = [...props.rooms];
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule your room.</Modal.Title>
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          onClick={() => props.handleReserve(props.date, selectedRoom)}
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

export default EmployeeView;
