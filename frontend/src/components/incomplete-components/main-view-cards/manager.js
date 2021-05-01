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
          <p className="card-text text-center">Manage your workplace and people.</p>

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
