import { useState, useEffect } from 'react';
import './calendar.css';
import { getCalendarDays } from './utils';
import { Form, Row, Col } from 'react-bootstrap';
import Header from '../header';
import { RoomsRepository } from '../../api/roomsRepository';
import { UserRepository } from '../../api/userRepository';
import { EmployeeRepository } from '../../api/employeeRepository';

const CalendarHeader = (props) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <header>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-6">
        <h2 className="month font-weight-bold mb-0 text-uppercase">
          {labels[props.month - 1]} {props.year}
        </h2>
        <div>
          <Row>
            <Form>
              <Col>
                <Form.Group controlId="calendar.selectMonth">
                  <Form.Label>Month</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => props.setMonth(e.target.value)}
                    value={props.month}
                  >
                    {months.map((m, index) => (
                      <option key={index}>{m}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="calendar.selectYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    value={props.year}
                    onChange={(e) => props.setYear(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Form>
            <div className="d-flex flex-column justify-content-center">
              <button className="btn btn-primary" onClick={() => props.sendMonthChangeRequest()}>
                Refresh Calendar
              </button>
            </div>
          </Row>
        </div>
      </div>
      <div className="row d-none d-sm-flex p-1 bg-dark text-white">
        <h5 className="col-sm p-1 text-center">Sunday</h5>
        <h5 className="col-sm p-1 text-center">Monday</h5>
        <h5 className="col-sm p-1 text-center">Tuesday</h5>
        <h5 className="col-sm p-1 text-center">Wednesday</h5>
        <h5 className="col-sm p-1 text-center">Thursday</h5>
        <h5 className="col-sm p-1 text-center">Friday</h5>
        <h5 className="col-sm p-1 text-center">Saturday</h5>
      </div>
    </header>
  );
};

const CalendarDay = (props) => {
  let { date, weekday, reservations, muted } = props;
  const today = new Date(date);

  const events = reservations ?? [];
  const reservationsToday = events.filter((res) => {
    const d = new Date(res.dateIn);
    return d.getDate() === today.getDate();
    // return d.getDate() == today.getDate() && d.getMonth() === today.getMonth();
  });

  if (muted)
    return (
      <div className="day col-sm p-2 border border-left-0 border-top-0 text-truncate d-none d-sm-inline-block bg-light text-muted">
        <h5 className="row align-items-center">
          <span className="date col-1">{today.getDate()}</span>
          <small className="col d-sm-none text-center text-muted">{weekday}</small>
          <span className="col-1"></span>
        </h5>
        <p className="d-sm-none">No events</p>
      </div>
    );
  else
    return (
      <div
        className="day col-sm p-2 border border-left-0 border-top-0 text-truncate"
        onClick={() => {
          console.log(reservationsToday);
          console.log('TODAY:', today);
        }}
      >
        <h5 className="row align-items-center">
          <span className="date col-1">{today.getDate()}</span>
          <small className="col d-sm-none text-center text-muted">{weekday}</small>
          <span className="col-1"></span>
        </h5>
        {reservationsToday.length === 0 ? (
          <p className="d-sm-none text-muted">No events</p>
        ) : reservationsToday.length > 2 ? (
          <>
            {' '}
            <CalendarEvent />{' '}
            <a
              className="event d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white"
              title="Test Event 3"
            >
              And {reservationsToday.length - 1} other(s).
            </a>
          </>
        ) : (
          reservationsToday.map((reservation, index) => {
            return <CalendarEvent key={index} reservation={reservation} />;
          })
        )}
      </div>
    );
};

const CalendarEvent = (props) => {
  return (
    <a
      className="event d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white"
      title="Test Event 3"
    >
      Event in Room: {props.reservation.roomId}
    </a>
  );
};

const Calendar = () => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [dates, setDates] = useState(getCalendarDays(new Date()));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [rooms, setRooms] = useState(undefined);
  const [schedules, setSchedules] = useState(undefined);
  const [reservations, setReservations] = useState(undefined);

  const changeMonth = () => {
    setDates(getCalendarDays(new Date(year, month - 1, 1)));
  };

  useEffect(() => {
    if (!dates) {
      setDates(getCalendarDays(new Date()));
    }

    if (!month || !year) {
      setMonth(dates[Math.floor(dates.length / 2)].getMonth() + 1);
      setYear(dates[0].getFullYear() + 1);
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
        if (res[1].success) {
          setSchedules(res[0].data);
          console.log('Schedules:', res[0].data);
        } else {
          setSchedules([]);
        }
      });
    }

    if (!reservations) {
      const employeeRepo = new EmployeeRepository();
      employeeRepo.getReservations(month - 1, year).then((res) => {
        if (res[1].success) {
          setReservations(res[0].data);
          console.log('Reservations:', res[0].data);
        } else {
          setReservations([]);
        }
      });
    }
  }, [month, year, dates, rooms, schedules, reservations]);

  return (
    <>
      <Header />
      <div className="container">
        <CalendarHeader
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          sendMonthChangeRequest={changeMonth}
        />
        <div className="row border border-right-0 border-bottom-0">
          {dates.map((date, index) => {
            const weekday = weekdays[index % 7];
            if (index % 7 === 0 && index !== 0) {
              return (
                <>
                  <div className="w-100" key={'div' + index} />
                  {date.getMonth() === month - 1 ? (
                    <CalendarDay
                      date={date}
                      weekday={weekday}
                      key={index}
                      reservations={reservations}
                    />
                  ) : (
                    <CalendarDay
                      muted
                      date={date}
                      weekday={weekday}
                      key={index}
                      reservations={reservations}
                    />
                  )}
                </>
              );
            } else {
              if (date.getMonth() === month - 1) {
                return (
                  <CalendarDay
                    date={date}
                    weekday={weekday}
                    key={index}
                    reservations={reservations}
                  />
                );
              } else {
                return (
                  <CalendarDay
                    date={date}
                    weekday={weekday}
                    key={index}
                    reservations={reservations}
                    muted
                  />
                );
              }
            }
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;
