import { useState, useEffect } from 'react';
import { getCalendarDays } from '../utils';
import { RoomsRepository } from '../../../api/roomsRepository';
import { UserRepository } from '../../../api/userRepository';
import { EmployeeRepository } from '../../../api/employeeRepository';
import { ManagerRepository } from '../../../api/managerRepository';
import { CovidCard } from '../cards';
import { UserTypes } from '../../../utils/constants';
import CalendarHeader from './header';
import CalendarDay from './day';
import EmployeeScheduleMoal from './modals/employee';
import ManagerScheduleModal from './modals/manager';
import './calendar.css';

const Calendar = (props) => {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const [dates, setDates] = useState(getCalendarDays(new Date()));
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [rooms, setRooms] = useState(undefined);
  const [schedules, setSchedules] = useState(undefined);
  const [reservations, setReservations] = useState(undefined);
  const [employees, setEmployees] = useState(undefined);

  const [manager, setManager] = useState(props.manager);

  const [newMonthReservations, setNewMonthReservations] = useState([]);

  const changeMonth = (m, y) => {
    const newStart = new Date(y, m - 1, 1);
    const employeeRepo = new EmployeeRepository();
    employeeRepo.getReservations(m, y).then((res) => {
      if (res[1].success) {
        const newDates = [...getCalendarDays(newStart)];
        const newRes = [...res[0].data];
        setNewMonthReservations([...newRes]);
        setDates([...newDates]);
        setMonth(m);
        setYear(y);
      } else {
        alert('Failed to get reservations');
      }
    });
  };

  const [isManagerScheduleShowing, setIsManagerScheduleShowing] = useState(false);
  const [isEmployeeScheduleShowing, setIsEmployeeScheduleShowing] = useState(false);

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
    let employeeToReserve = employee;

    const managerRepository = new ManagerRepository();
    const userRepository = new UserRepository();

    if (typeof employeeToReserve == 'string') {
      employeeToReserve = employees.find((emp) => {
        return emp.firstName + ' ' + emp.lastName === employeeToReserve;
      });
    }

    managerRepository
      .createReservation(
        roomToReserve.roomId,
        new Date(day),
        new Date(day),
        employeeToReserve.userId ?? userRepository.currentUser().userId
      )
      .then((res) => {
        if (res[1].success) {
          const newReservations = [...reservations];
          newReservations.push({
            roomId: roomToReserve.roomId,
            userId: employeeToReserve.userId,
            dateIn: new Date(day)
          });
          setReservations([...newReservations]);
        } else {
          alert('Failed to reserve room');
        }
      })
      .then(() => {
        if (manager) {
          handleCloseManagerSchedule();
        } else {
          handleCloseEmployeeSchedule();
        }
      });
  };

  useEffect(() => {
    const l = JSON.stringify(newMonthReservations);
    const r = JSON.stringify(reservations);

    if (l !== r) {
      setReservations([...newMonthReservations]);
    }
  }, [newMonthReservations]);

  useEffect(() => {
    if (manager === undefined) {
      const userRepository = new UserRepository();
      setManager(userRepository.currentUser().role === UserTypes.manager ? true : false);
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
  }, [month, year, dates, rooms, schedules, reservations, employees, manager]);

  return (
    <>
      <div className="container mb-4">
        {employees && rooms && reservations && (
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
          {employees &&
            reservations &&
            dates &&
            dates.map((date, index) => {
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
                        onOpenDate={() => {
                          if (manager) handleManagerOpenSchedule(date);
                          else handleEmployeeOpenSchedule(date);
                        }}
                        employees={employees}
                      />
                    ) : (
                      <CalendarDay
                        muted
                        date={date}
                        weekday={weekday}
                        key={index}
                        reservations={reservations}
                        onOpenDate={() => {}}
                        employees={employees}
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
                      employees={employees}
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
                      employees={employees}
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
            <CovidCard className="col-md-4 col-xs-9" />
          </div>
        )}
      </div>
    </>
  );
};

export default Calendar;
