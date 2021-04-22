import './styles/employee.css';
import './styles/calendar.css';
import React, { useEffect, useState } from 'react';
import { getDays } from './utils';
import { CovidCard, RoomCard, TimeCard } from './cards';
import { Modal, Form } from 'react-bootstrap';
import { RoomsRepository } from '../../api/roomsRepository';
import { UserRepository } from '../../api/userRepository';
import { ReservationsRepository } from '../../api/reservationsRepository';
import { EmployeeRepository } from '../../api/employeeRepository';

const RenderReservations = (props) => {
  const date = props.date;
  const reservations = props.reservations ?? [];

  const reservationsToday = reservations.filter((res) => {
    const d = new Date(res.dateIn);

    return d.getDate() == date;
  });

  if (reservationsToday.length > 2) {
    return (
      <>
        <div className="event bg-primary">Room: {reservationsToday[0].roomId}</div>;
        <div className="event bg-primary">And {reservationsToday.length} other(s)</div>;
      </>
    );
  } else {
    return (
      <>
        {reservationsToday.map((res, index) => {
          return <div className="event bg-primary">Room: {res.roomId}</div>;
        })}
      </>
    );
  }
};

const EmployeeView = () => {
  const [days, setDays] = useState();
  const [rooms, setRooms] = useState(undefined);

  const [month, setMonth] = useState(4);
  const [year, setYear] = useState(2021);

  const [schedules, setSchedules] = useState(undefined);
  const [reservations, setReservations] = useState(undefined);

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    if (!days) {
      setDays(getDays(new Date()));
    }

    if (!month || !year) {
      setMonth(days[Math.floor(days.length / 2)].getMonth() + 1);
      setYear(days[0].getFullYear() + 1);
    }

    if (!rooms) {
      const roomsRepository = new RoomsRepository();
      const userRepository = new UserRepository();

      roomsRepository
        .getRooms(userRepository.currentUser().username, userRepository.currentUser().password)
        .then((res) => {
          if (res[1].success === false) {
            alert('Failed to get rooms, contact a manager!');
          } else {
            setRooms(res[0].data);
          }
        });
    }

    if (!schedules) {
      const employeeRepo = new EmployeeRepository();
      employeeRepo.getSchedules(month, year).then((res) => {
        console.log('Schedules:', res);
        setSchedules(res);
      });
    }

    if (!reservations) {
      const employeeRepo = new EmployeeRepository();
      employeeRepo.getReservations(month - 1, year).then((res) => {
        console.log('Reservations:', res);
        setReservations(res);
      });
    }
  }, [month, year, days, rooms, schedules, reservations]);

  const [isScheduleShowing, setIsScheduleShowing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleOpenSchedule = (date) => {
    setSelectedDate(date);
    setIsScheduleShowing(true);
  };
  const handleCloseSchedule = () => setIsScheduleShowing(false);

  const handleReserve = (day, room) => {
    const employeeRepo = new EmployeeRepository();
    const userRepo = new UserRepository();
    employeeRepo
      .createReservation(room, day, day, userRepo.currentUser().userId, userRepo.currentUser().role)
      .then((res) => {
        if (res[1].success == true) {
          const newR = {
            reservationId: res[0].data.insertId,
            roomId: room,
            dateIn: day,
            dateOut: day,
            userId: userRepo.currentUser().userId
          };
          const newRes = [...reservations, newR];
          setReservations(newRes);
        } else {
          alert('Failed to create reservation: ' + res[1].reason);
        }
      });
    handleCloseSchedule();
  };

  const sendMonthChangeRequest = async () => {
    setReservations(undefined);
    setSchedules(undefined);
    const day = new Date();
    day.setMonth(month);
    day.setFullYear(year);
    setDays(getDays(day));
  };

  return (
    <div className="container pb-5 flex-row">
      <div className="calendar shadow bg-white p-5">
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="month font-weight-bold mb-0 text-uppercase">April 2021</h2>
          <div>
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
                  as="input"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Form>
            <button className="btn btn-primary" onClick={() => sendMonthChangeRequest()}>
              Change Month
            </button>
          </div>
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
          {days &&
            days.map((day) => {
              return (
                <li key={day} onClick={() => handleOpenSchedule(day)}>
                  <div className="date">{day.getDate()}</div>
                  <RenderReservations date={day.getDate()} reservations={reservations} />
                  {/* { reservations &&
                    reservations.length >=2 ? <div className="event bg-primary">And n others</div> : 
                    reservations.map((reservation, index) => {
                      <div className="event bg-primary" key={index}>There is an event today in room 2001</div>
                    })
                  } */}
                </li>
              );
            })}
        </ol>
      </div>
      <TimeCard />
      <RoomCard />
      <CovidCard />
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
  const rooms = props.rooms ? [...props.rooms] : [];
  const [selectedRoom, setSelectedRoom] = useState(rooms ? rooms[0] : undefined);
  const [disabled] = useState(rooms.length === 0 ? true : false);

  console.log(rooms);
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule your room.</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {disabled && <p className="text-danger">No rooms currently available.</p>}

        {!disabled && (
          <>
            <p>Selected Date: {props.date.toDateString()}</p>
            <Form>
              <Form.Group controlId="scheduleForm.room">
                <Form.Label>Room Number</Form.Label>
                <Form.Control as="select" onChange={(e) => setSelectedRoom(e.target.value)}>
                  {rooms.map((room) => (
                    <option key={room.roomId}>{room.roomId}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        {!disabled && (
          <button
            className="btn btn-success"
            onClick={() => props.handleReserve(props.date, selectedRoom ?? 1)}
          >
            Reserve
          </button>
        )}
        <button className="btn btn-danger" onClick={props.handleClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeView;
