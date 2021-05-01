const CalendarEvent = (props) => {
  return (
    <a
      className="event d-block p-1 pl-2 pr-2 mb-1 rounded text-truncate small bg-success text-white"
      title={'Event in Room: ' + props.reservation.roomId}
      style={{ pointerEvents: 'none' }}
    >
      Event in Room: {props.reservation.roomId}
    </a>
  );
};

export default CalendarEvent;
