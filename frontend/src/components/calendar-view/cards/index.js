import React, { useState } from "react";
import EmployeesModal from "./modals/employees";
import ManagerRoomsModal from "./modals/manager-room";
import { Link, Redirect } from "react-router-dom";
import RoomsModal from "./modals/rooms";
import ReportCovidModal from "./modals/report-covid";
import ReportContactModal from "./modals/report-contact";
import StatsModal from "./modals/stats";
import TimeStatsModal from "./modals/time-stats";
import { ClockInModal, ClockOutModal } from "./modals/clock-in";
import { UserRepository } from "../../../api/userRepository";
import { EmployeeRepository } from "../../../api/employeeRepository";

export const CovidCard = () => {
  const [isReportCovidModalShowing, setIsReportCovidModalShowing] = useState(
    false
  );
  const handleReportCovidClose = () => setIsReportCovidModalShowing(false);
  const handleReportCovidOpen = () => setIsReportCovidModalShowing(true);

  const [
    isReportContactModalShowing,
    setIsReportContactModalShowing,
  ] = useState(false);
  const handleReportContactClose = () => setIsReportContactModalShowing(false);
  const handleReportContactOpen = () => setIsReportContactModalShowing(true);

  const userRepository = new UserRepository();

  const [hasCovid, setHasCovid] = useState(
    userRepository.currentUser().covidStatus == 1 ? true : false
  );

  const covidReported = () => {
    setHasCovid(true);
    userRepository
      .editCovidStatus(userRepository.currentUser().userId, 1)
      .then((res) => {});
  };

  const contactReported = (reportedUser) => {
    const employeeRepository = new EmployeeRepository();
    employeeRepository
      .reportContact(
        reportedUser.userId,
        userRepository.currentUser().userId,
        ""
      )
      .then(() => {
        employeeRepository.setExposure(reportedUser.userId).then();
      });
  };

  return (
    <div className="col mt-3">
      <div className="covidcard shadow">
        <div className=" clock-card">
          <div className="card-body">
            <h5 className="text-center">COVID-19</h5>
            <p className="card-text text-center">
              Report Covid or Contact Trace.
            </p>
            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                {hasCovid ? (
                  <button
                    className="btn btn-warning text-light"
                    onClick={handleReportContactOpen}
                  >
                    Report Contact
                  </button>
                ) : (
                  <button
                    className="btn btn-danger mb-2"
                    onClick={handleReportCovidOpen}
                  >
                    Report Covid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ReportCovidModal
          handleClose={handleReportCovidClose}
          show={isReportCovidModalShowing}
          reportCovid={covidReported}
        />
        <ReportContactModal
          handleClose={handleReportContactClose}
          show={isReportContactModalShowing}
          reportContact={contactReported}
        />
      </div>
    </div>
  );
};

export const RoomCard = () => {
  const [isRoomsModalShowing, setIsRoomsModalShowing] = useState(false);
  const handleRoomsClose = () => setIsRoomsModalShowing(false);
  const handleRoomsOpen = () => setIsRoomsModalShowing(true);

  const [isStatsModalShowing, setIsStatsModalShowing] = useState(false);
  const handleStatsClose = () => setIsStatsModalShowing(false);
  const handleStatsOpen = () => setIsStatsModalShowing(true);

  return (
    <div className="col mt-3">
      <div className="roomcard shadow">
        <div className=" clock-card">
          <div className="card-body">
            <h5 className="text-center">Rooms</h5>
            <p className="card-text">
              Create meetings, reserve rooms, and checkout the covid status of
              the office.
            </p>
            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                <Link to="/rooms" className="btn btn-primary mb-2">
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
    <div className="col mt-3">
      <div className="shadow">
        <div className="clock-card">
          <div className="card-body">
            <h5 className="text-center">My Time</h5>
            <p className="card-text text-center">Manage your time status</p>

            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                <button
                  onClick={handleClockInOpen}
                  className="btn btn-success mb-2"
                >
                  Clock In
                </button>
                <button
                  onClick={handleClockOutOpen}
                  className="btn btn-danger mb-2"
                >
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
        <TimeStatsModal
          handleClose={handleTimeStatsClose}
          show={isTimeStatsModalShowing}
        />
        <ClockInModal
          handleClose={handleClockInClose}
          show={isClockInModalShowing}
        />
        <ClockOutModal
          handleClose={handleClockOutClose}
          show={isClockOutModalShowing}
        />
      </div>
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
    <div className="mt-3 roomcard shadow ">
      <div className="card clock-card">
        <div className="card-body">
          <h5 className="text-center">Manager Controls</h5>
          <p className="card-text text-center">
            Manage your workplace and people.
          </p>

          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-column">
              <button
                onClick={handleRoomsOpen}
                className="btn btn-success mb-2"
              >
                View Rooms
              </button>
              <button
                onClick={handleEmployeesOpen}
                className="btn btn-danger mb-2"
              >
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
