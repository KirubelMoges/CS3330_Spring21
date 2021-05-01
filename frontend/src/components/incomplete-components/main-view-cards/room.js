export const RoomCard = () => {
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
              Create meetings, reserve rooms, and checkout the covid status of the office.
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
        <StatsModal handleClose={handleStatsClose} show={isStatsModalShowing} />
      </div>
    </div>
  );
};
