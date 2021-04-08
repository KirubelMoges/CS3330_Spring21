import './styles/employee.css';
import './styles/calendar.css';
import React, { useState } from 'react';
import { getDays } from './utils';
import { RoomCard, TimeCard } from './cards';
import { Modal } from 'react-bootstrap';

const EmployeeView = () => {
  const days = getDays(new Date());

  const [isScheduleShowing, setIsScheduleShowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleOpenSchedule = (date) => {
    setSelectedDate(date);
    setIsScheduleShowing(true);
  };
  const handleCloseSchedule = () => setIsScheduleShowing(false);

  const handleReserve = (day) => {
    console.log(day);
    handleCloseSchedule();
  };

  return (
    <div className="container pb-5">
      <div className="calendar shadow bg-white p-5">
        <div className="d-flex align-items-center">
          <h2 className="month font-weight-bold mb-0 text-uppercase">April 2021</h2>
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
                {(day.getDate() < 2 || day.getDate() === 11) && (
                  <div className="event bg-primary">There is an event today in room 2001</div>
                )}
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
      />
    </div>
  );
};

const ScheduleModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule your room.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Selected Date: {props.date.toDateString()}</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={() => props.handleReserve(props.date)}>
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
