import { useState, useEffect } from "react";
import "./calendar.css";
import { getCalendarDays } from "./utils";
import { Form, Row, Col, Modal } from "react-bootstrap";
import { RoomsRepository } from "../../api/roomsRepository";
import { UserRepository } from "../../api/userRepository";
import { EmployeeRepository } from "../../api/employeeRepository";
import { ManagerRepository } from "../../api/managerRepository";
import { ManagerControls, TimeCard, CovidCard } from "./cards";
import { UserTypes } from "../../utils/constants";

const CalendarHeader = (props) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [formMonth, setFormMonth] = useState(props.month);
  const [formYear, setFormYear] = useState(props.year);

  return (
    <header>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-6">
        <h2 className="month font-weight-bold mb-0 text-uppercase display-3">
          {labels[props.month - 1]} {props.year}
        </h2>
        <div className="ml-4 mr-1">
          <Row>
            <Form>
              <Col>
                <Form.Group controlId="calendar.selectMonth">
                  <Form.Label>Month</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setFormMonth(e.target.value)}
                    value={formMonth}
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
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Form>
            <div className="d-flex flex-column justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  //   props.setMonth(formMonth);
                  //   props.setYear(formYear);
                  props.sendMonthChangeRequest(formMonth, formYear);
                }}
              >
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
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  });

  if (muted)
    return (
      <div className="day col-sm p-2 border border-left-0 border-top-0 text-truncate d-none d-sm-inline-block bg-light text-muted">
        <h5 className="row align-items-center">
          <span className="date col-1">{today.getDate()}</span>
          <small className="col d-sm-none text-center text-muted">
            {weekday}
          </small>
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
          <small className="col d-sm-none text-center text-muted">
            {weekday}
          </small>
          <span className="col-1"></span>
        </h5>
        {reservationsToday.length === 0 ? (
          <p className="d-sm-none text-muted">No events</p>
        ) : reservationsToday.length > 2 ? (
          <>
            <CalendarEvent reservation={reservations[0]} />
            <a
              className="event d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white"
              title="Test Event 3"
              style={{ pointerEvents: "none" }}
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
      title={"Event in Room: " + props.reservation.roomId}
      style={{ pointerEvents: "none" }}
    >
      Event in Room: {props.reservation.roomId}
    </a>
  );
};

const Calendar = (props) => {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [dates, setDates] = useState(getCalendarDays(new Date()));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [rooms, setRooms] = useState(undefined);
  const [schedules, setSchedules] = useState(undefined);
  const [reservations, setReservations] = useState(undefined);
  const [employees, setEmployees] = useState(undefined);

  const [manager, setManager] = useState(props.manager);

  const changeMonth = (m, y) => {
    const newStart = new Date(y, m - 1, 1);
    const employeeRepo = new EmployeeRepository();
    employeeRepo.getReservations(m, y).then((res) => {
      if (res[1].success) {
        setReservations(res[0].data);
        setDates(getCalendarDays(newStart));
        setMonth(m);
        setYear(y);
      } else {
        alert("Failed to get reservations");
      }
    });
  };

  const [isManagerScheduleShowing, setIsManagerScheduleShowing] = useState(
    false
  );
  const [isEmployeeScheduleShowing, setIsEmployeeScheduleShowing] = useState(
    false
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleManagerOpenSchedule = (date) => {
    setSelectedDate(date);
    setIsManagerScheduleShowing(true);
  };
  const handleCloseManagerSchedule = () => setIsManagerScheduleShowing(false);

  const handleEmployeeOpenSchedule = (date) => {
    const userRepository = new UserRepository();
    if (userRepository.currentUser().covidStatus !== 1) {
      setSelectedDate(date);
      setIsEmployeeScheduleShowing(true);
    }
  };
  const handleCloseEmployeeSchedule = () => setIsEmployeeScheduleShowing(false);

  const handleReserve = (day, room, employee) => {
    const roomToReserve = room;
    const employeeToReserve = employee;

    const managerRepository = new ManagerRepository();
    const userRepository = new UserRepository();
    managerRepository
      .createReservation(
        roomToReserve.roomId,
        new Date(day),
        new Date(day),
        employeeToReserve.userId ?? userRepository.currentUser().userId
      )
      .then((res) => {
        if (res[1].success) {
          setReservations([
            ...reservations,
            {
              roomId: roomToReserve.roomId,
              userId: employeeToReserve.userId,
              dateIn: new Date(day),
            },
          ]);
          handleCloseManagerSchedule();
          handleCloseEmployeeSchedule();
        } else {
          alert("Failed to reserve room");
        }
      });
  };

  useEffect(() => {
    if (manager === undefined) {
      const userRepository = new UserRepository();
      setManager(
        userRepository.currentUser().role === UserTypes.manager ? true : false
      );
    }

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
        .getRooms(
          userRepository.currentUser().username,
          userRepository.currentUser().password
        )
        .then((res) => {
          if (res[1].success === false) {
            alert("Failed to get rooms, contact a manager!");
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
        } else {
          setSchedules([]);
        }
      });
    }

    if (!reservations) {
      const employeeRepo = new EmployeeRepository();
      employeeRepo.getReservations(month, year).then((res) => {
        if (res[1].success) {
          setReservations(res[0].data);
        } else {
          setReservations([]);
        }
      });
    }

    if (!employees) {
      const userRepository = new UserRepository();
      userRepository.getAllUsers().then((res) => {
        if (res[1].success) {
          setEmployees(res[0].data);
        } else {
          setEmployees([]);
        }
      });
    }
  }, [month, year, dates, rooms, schedules, reservations, employees]);

  return (
    <>
      <div className="container mb-4">
        {employees && rooms && (
          <>
            <ManagerScheduleModal
              show={isManagerScheduleShowing}
              handleClose={handleCloseManagerSchedule}
              date={selectedDate}
              handleReserve={handleReserve}
              employees={employees}
              rooms={rooms}
            />
            <EmployeeScheduleMoal
              show={isEmployeeScheduleShowing}
              handleClose={handleCloseEmployeeSchedule}
              date={selectedDate}
              handleReserve={handleReserve}
              employees={employees}
              rooms={rooms}
            />
          </>
        )}
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
                  <div className="w-100" key={"div" + index} />
                  {date.getMonth() === month - 1 ? (
                    <CalendarDay
                      date={date}
                      weekday={weekday}
                      key={index}
                      reservations={reservations}
                      onOpenDate={() => {
                        if (manager) handleManagerOpenSchedule(date);
                        else handleEmployeeOpenSchedule(date);
                      }}
                    />
                  ) : (
                    <CalendarDay
                      muted
                      date={date}
                      weekday={weekday}
                      key={index}
                      reservations={reservations}
                      onOpenDate={() => {}}
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
                    onOpenDate={() => {
                      if (manager) handleManagerOpenSchedule(date);
                      else handleEmployeeOpenSchedule(date);
                    }}
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
                    onOpenDate={() => {}}
                  />
                );
              }
            }
          })}
        </div>
        {employees && rooms && reservations && manager ? (
          <CovidCard />
        ) : (
          <div className="row">
            <TimeCard className="col-md-4 col-xs-9" />
            <CovidCard className="col-md-4 col-xs-9" />
          </div>
        )}
      </div>
    </>
  );
};

const EmployeeScheduleMoal = (props) => {
  const rooms = [...props.rooms];
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].roomId);
  const date = new Date(props.date);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule a Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Selected Date: {date.toDateString()}</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Room Number</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <option key={room.roomId}>{room.roomId}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {rooms.length > 0 && (
          <button
            className="btn btn-success"
            onClick={() => {
              const reservationRoom = rooms.find((rm) => {
                return rm.roomId == selectedRoom;
              });
              const userRepository = new UserRepository();
              props.handleReserve(
                props.date,
                reservationRoom,
                userRepository.currentUser()
              );
            }}
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

const ManagerScheduleModal = (props) => {
  const rooms = [...props.rooms];
  const employees = [...props.employees];

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].roomId);

  const date = new Date(props.date);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule an Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Selected Date: {date.toDateString()}</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Room Number</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              {rooms.map((room) => (
                <option key={room.roomId}>{room.roomId}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="scheduleForm.employee">
            <Form.Label>Employee</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map((employee) => (
                <option key={employee.userId}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {rooms.length > 0 && employees.length > 0 && (
          <button
            className="btn btn-success"
            onClick={() => {
              const reservationRoom = rooms.find((rm) => {
                return rm.roomId == selectedRoom;
              });
              props.handleReserve(
                props.date,
                reservationRoom,
                selectedEmployee
              );
            }}
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

export default Calendar;
