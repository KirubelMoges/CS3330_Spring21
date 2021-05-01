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
    </div>
  );
};
