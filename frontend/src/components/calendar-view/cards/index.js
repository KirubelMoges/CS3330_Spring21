import React, { useState } from 'react';

import RoomsModal from './modals/rooms';
import StatsModal from './modals/stats';
import TimeStatsModal from './modals/time-stats';

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
              <button className="btn btn-primary mb-2" onClick={handleRoomsOpen}>
                View Rooms
              </button>
              <button onClick={handleStatsOpen} className="btn btn-info">
                Covid Stats
              </button>
            </div>
          </div>
        </div>
      </div>
      <RoomsModal handleClose={handleRoomsClose} show={isRoomsModalShowing} />
      <StatsModal handleClose={handleStatsClose} show={isStatsModalShowing} />
    </div>
  );
};

export const TimeCard = () => {
  const [isTimeStatsModalShowing, setIsTimeStatsModalShowing] = useState(false);
  const handleTimeStatsClose = () => setIsTimeStatsModalShowing(false);
  const handleTimeStatsOpen = () => setIsTimeStatsModalShowing(true);

  return (
    <div className="timecard shadow ">
      <div className="card clock-card">
        <div className="card-body">
          <h5 className="card-title">My Time</h5>
          <p className="card-text">Manage your time status, and view your time breakdown.</p>

          <div className="d-flex flex-row justify-content-center">
            <div className="d-flex flex-column">
              <button onClick={() => alert('Clocked In!')} className="btn btn-success mb-2">
                Clock In
              </button>
              <button onClick={() => alert('Clocked Out!')} className="btn btn-danger mb-2">
                Clock Out
              </button>
              <button onClick={() => alert('Lunch Time!')} className="btn btn-primary mb-2">
                Lunch Break
              </button>
              <button onClick={handleTimeStatsOpen} className="btn btn-info">
                View Stats
              </button>
            </div>
          </div>
        </div>
      </div>
      <TimeStatsModal handleClose={handleTimeStatsClose} show={isTimeStatsModalShowing} />
    </div>
  );
};
