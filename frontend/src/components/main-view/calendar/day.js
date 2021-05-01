import { useState, useEffect } from 'react';
import { UserRepository } from '../../../api/userRepository';
import CalendarEvent from './event';

const CalendarDay = (props) => {
  let { date, weekday, reservations, muted, employees } = props;
  const [today, setToday] = useState(new Date(date));
  const [reservationsToday, setReservationsToday] = useState([]);
  const [events, setEvents] = useState(reservations ?? []);
  const [emps] = useState(employees ?? []);

  useEffect(() => {
    const l = JSON.stringify(events);
    const r = JSON.stringify(reservations);

    if (l !== r) {
      setEvents(reservations);
    }
  }, [reservations]);

  useEffect(() => {
    const newDate = new Date(date);

    if (newDate !== today) {
      setToday(newDate);
    }
  }, [date]);

  useEffect(() => {
    const userRepository = new UserRepository();
    const eventsToday = events.filter((res) => {
      const d = new Date(res.dateIn);

      const userIds = emps.map((us) => {
        if (us.officeId === userRepository.currentUser().officeId) {
          return us.userId;
        }
      });

      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear() &&
        userIds.includes(res.userId)
      );
    });

    if (eventsToday.length !== reservationsToday.length) setReservationsToday(eventsToday);
  }, [events]);

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
        onClick={props.onOpenDate}
      >
        <h5 className="row align-items-center">
          <span className="date col-1">{today.getDate()}</span>
          <small className="col d-sm-none text-center text-muted">{weekday}</small>
          <span className="col-1"></span>
        </h5>
        {!reservationsToday || reservationsToday.length === 0 ? (
          <p className="d-sm-none text-muted">No events</p>
        ) : reservationsToday.length > 2 ? (
          <>
            <CalendarEvent reservation={reservations[0]} />
            <a
              className="event d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white"
              title="Test Event 3"
              style={{ pointerEvents: 'none' }}
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

export default CalendarDay;
