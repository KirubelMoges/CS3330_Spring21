import './employee.css';

function getDaysInMonth(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  //get first day of the month
  // if it is not a sunday append the days from the month prior
  const firstDay = days[0];
  const weekday = firstDay.getDay();
  if (weekday === 0) {
    return days;
  }

  // The first day is not a sunday
  const numberOfDaysToAdd = weekday;
  const newMonth = month > 0 ? month - 1 : 12;
  const newYear = month > 0 ? year : year - 1;
  const newDays = getDaysInLastMonth(newMonth, newYear, numberOfDaysToAdd);
  console.log('New Days', newDays);
  days = newDays.concat(days);

  return days.splice(0, 28);
}

function getDaysInLastMonth(month, year, numberOfDays) {
  var date = new Date(year, month, 1);
  var days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days.slice(-numberOfDays);
}

const EmployeeView = () => {
  var d = new Date();
  const days = getDaysInMonth(d.getMonth(), d.getFullYear());
  console.log(days);

  return (
    <div className="container pb-5">
      <div className="calendar shadow bg-white p-5">
        <div className="d-flex align-items-center">
          <h2 className="month font-weight-bold mb-0 text-uppercase">April 2021</h2>
        </div>
        <p className="font-italic text-muted mb-5">No events today.</p>
        <ol className="day-names list-unstyled mb-0">
          <li className="font-weight-bold text-uppercase">Sun</li>
          <li className="font-weight-bold text-uppercase">Mon</li>
          <li className="font-weight-bold text-uppercase">Tue</li>
          <li className="font-weight-bold text-uppercase">Wed</li>
          <li className="font-weight-bold text-uppercase">Thu</li>
          <li className="font-weight-bold text-uppercase">Fri</li>
          <li className="font-weight-bold text-uppercase">Sat</li>
        </ol>

        <ol className="days list-unstyled">
          {days.map((day) => {
            return (
              <li key={day}>
                <div className="date">{day.getDate()}</div>
                {(day.getDate() < 2 || day.getDate() === 11) && (
                  <div className="event bg-primary">There is an event today in room 2001</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="timecard shadow ">
        <div className="card clock-card">
          <div className="card-body">
            <h5 className="card-title">My Time</h5>
            <p className="card-text">Manage your time status, and view your time breakdown.</p>

            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                <a href="#" className="btn btn-success mb-2">
                  Clock In
                </a>
                <a href="#" className="btn btn-danger mb-2">
                  Clock Out
                </a>
                <a href="#" className="btn btn-primary mb-2">
                  Lunch Break
                </a>
                <a href="#" className="btn btn-info">
                  View Stats
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="roomcard shadow">
        <div className="card clock-card">
          <div className="card-body">
            <h5 className="card-title">Rooms</h5>
            <p className="card-text">
              Create meetings, reserve rooms, and checkout the covid status of the office.
            </p>
            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                <a href="#" className="btn btn-primary mb-2">
                  View Rooms
                </a>
                <a href="#" className="btn btn-info">
                  Covid Stats
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
