import React, {useState } from 'react';
import EmployeesModal from './modals/employees';
import ManagerRoomsModal from './modals/manager-room';
import { Link, Redirect } from 'react-router-dom';
import RoomsModal from './modals/rooms';
import StatsModal from './modals/stats';
import TimeStatsModal from './modals/time-stats';
import { ClockInModal, ClockOutModal } from './modals/clock-in';

export const RoomCard = () => {
  const [isRoomsModalShowing, setIsRoomsModalShowing] = useState(false);
  const handleRoomsClose = () => setIsRoomsModalShowing(false);
  const handleRoomsOpen = () => setIsRoomsModalShowing(true);

  const [isStatsModalShowing, setIsStatsModalShowing] = useState(false);
  const handleStatsClose = () => setIsStatsModalShowing(false);
  const handleStatsOpen = () => setIsStatsModalShowing(true);

  return (
    <div className="roomcard shadow">
      <div className="card clock-card">
        <div className="card-body">
          <h5 className="card-title">Rooms</h5>
          <p className="card-text">
            Create meetings, reserve rooms, and checkout the covid status of the office.
          </p>
          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-column">
              <Link to="/rooms" className="btn btn-primary mb-2" >
                View Rooms
              </Link>
              <button onClick={handleStatsOpen} className="btn btn-info">
                Covid Stats
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <RoomsModal handleClose={handleRoomsClose} show={isRoomsModalShowing} /> */}
      <StatsModal handleClose={handleStatsClose} show={isStatsModalShowing} />
    </div>
  );
};

export const TimeCard = () => {
  const [isTimeStatsModalShowing, setIsTimeStatsModalShowing] = useState(false);
  const handleTimeStatsClose = () => setIsTimeStatsModalShowing(false);
  const handleTimeStatsOpen = () => setIsTimeStatsModalShowing(true);

  const [isClockInModalShowing, setIsClockInModalShowing] = useState(false);
  const handleClockInClose = () => setIsClockInModalShowing(false);
  const handleClockInOpen = () => setIsClockInModalShowing(true);

  const [isClockOutModalShowing, setIsClockOutModalShowing] = useState(false);
  const handleClockOutClose = () => setIsClockOutModalShowing(false);
  const handleClockOutOpen = () => setIsClockOutModalShowing(true);

  return (
    <div className="timecard shadow ">
      <div className="card clock-card">
        <div className="card-body">
          <h5 className="card-title">My Time</h5>
          <p className="card-text">Manage your time status, and view your time breakdown.</p>

          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-column">
              <button onClick={handleClockInOpen} className="btn btn-success mb-2">
                Clock In
              </button>
              <button onClick={handleClockOutOpen} className="btn btn-danger mb-2">
                Clock Out
              </button>
              {/* <button onClick={() => alert('Lunch Time!')} className="btn btn-primary mb-2">
                Lunch Break
              </button> */}
              <button onClick={handleTimeStatsOpen} className="btn btn-info">
                View Stats
              </button>
            </div>
          </div>
        </div>
      </div>
      <TimeStatsModal handleClose={handleTimeStatsClose} show={isTimeStatsModalShowing} />
      <ClockInModal handleClose={handleClockInClose} show={isClockInModalShowing} />
      <ClockOutModal handleClose={handleClockOutClose} show={isClockOutModalShowing} />
    </div>
  );
};

export const ManagerControls = (props) => {
  const [isEmployeesModalShowing, setIsEmployeesModalShowing] = useState(false);
  const handleEmployeesClose = () => setIsEmployeesModalShowing(false);
  const handleEmployeesOpen = () => setIsEmployeesModalShowing(true);

  const [isRoomsModalShowing, setIsRoomsModalShowing] = useState(false);
  const handleRoomsClose = () => setIsRoomsModalShowing(false);
  const handleRoomsOpen = () => setIsRoomsModalShowing(true);

  return (
    <div className="roomcard shadow ">
      <div className="card clock-card">
        <div className="card-body">
          <h5 className="card-title">Manager Controls</h5>
          <p className="card-text">Manage your workplace and people.</p>

          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-column">
              <button onClick={handleRoomsOpen} className="btn btn-success mb-2">
                View Rooms
              </button>
              <button onClick={handleEmployeesOpen} className="btn btn-danger mb-2">
                View Employees
              </button>
            </div>
          </div>
        </div>
      </div>
      <EmployeesModal
        handleClose={handleEmployeesClose}
        show={isEmployeesModalShowing}
        employees={props.employees}
        events={props.events}
      />
      <ManagerRoomsModal
        handleClose={handleRoomsClose}
        show={isRoomsModalShowing}
        rooms={props.rooms}
        events={props.events}
      />
    </div>
  );
};
