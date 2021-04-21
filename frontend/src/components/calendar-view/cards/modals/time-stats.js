import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { ClockRepository } from '../../../../api/clockingRepository';
import { UserRepository } from '../../../../api/userRepository';
import { UserTypes } from '../../../../utils/constants';

const TimeStatsModal = (props) => {
  const [timeData, setTimeData] = useState(undefined);
  const [showRequestTimeChange, setShowRequestTimeChange] = useState(false);
  const [clockInHour, setClockInHour] = useState(8);
  const [clockInMinute, setClockInMinute] = useState(0);
  const [clockOutHour, setClockOutHour] = useState(17);
  const [clockOutMinute, setClockOutMinute] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [clockId, setClockId] = useState(0);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const userRepository = new UserRepository();
    const clockRepository = new ClockRepository();

    if (timeData === undefined) {
      clockRepository
        .getClockData(userRepository.currentUser().username, userRepository.currentUser().password)
        .then((data) => {
          if (data[1].success === true) {
            setTimeData(data[0]);
          } else {
            setTimeData([]);
          }
        });
    }

    console.log(timeData);
  }, [timeData, setTimeData]);

  const constructDate = (hour, minute) => {
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    return date;
  };

  const validateSendRequest = () => {
    const regexp = /^[0-9\b]+$/;

    if (isLoading) return false;

    const validateInHours = () => clockInHour !== '' || regexp.test(clockInHour);
    const validateInMinutes = () => clockInMinute !== '' || regexp.test(clockInMinute);
    const validateOutHours = () => clockOutHour !== '' || regexp.test(clockOutHour);
    const validateOutMinutes = () => clockOutMinute !== '' || regexp.test(clockOutMinute);
    const validateClockId = () => clockId !== '' || regexp.test(clockId);

    const res =
      validateInHours() &&
      validateInMinutes() &&
      validateOutHours() &&
      validateOutMinutes() &&
      validateClockId();
    return res;
  };

  const sendChangeRequest = () => {
    const userRepository = new UserRepository();
    const clockRepository = new ClockRepository();

    setIsLoading(true);

    clockRepository
      .requestClockChange(
        userRepository.currentUser().username,
        clockId,
        constructDate(clockInHour, clockInMinute),
        constructDate(clockOutHour, clockOutMinute),
        UserTypes.employee,
        UserTypes.manager,
        new Date()
      )
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        if (res.success === false) {
          setError(res.reason);
        }
      });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Time Stats</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You have clocked in at the following times:</p>
        {timeData &&
          timeData.map((data, index) => {
            const clockInTime = new Date(data.clockIn);
            return (
              <p key={index}>
                {clockInTime.toLocaleDateString()} - {clockInTime.toLocaleTimeString()}
              </p>
            );
          })}
        {showRequestTimeChange && (
          <Form>
            {error && <p className="text-danger">{error}</p>}
            <Form.Group size="md" controlId="email">
              <Form.Label>Clock In Hour(s)</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                value={clockInHour}
                onChange={(e) => setClockInHour(e.target.value)}
                isInvalid={false}
              />
              <Form.Label>Clock In Minute(s)</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                value={clockInMinute}
                onChange={(e) => setClockInMinute(e.target.value)}
                isInvalid={false}
              />
              <Form.Label>Clock Out Hour(s)</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                value={clockOutHour}
                onChange={(e) => setClockOutHour(e.target.value)}
                isInvalid={false}
              />
              <Form.Label>Clock Out Minute(s)</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                value={clockOutMinute}
                onChange={(e) => setClockOutMinute(e.target.value)}
                isInvalid={false}
              />
              <Form.Label>Clock ID</Form.Label>
              <Form.Control
                autoFocus
                type="number"
                value={clockId}
                onChange={(e) => setClockId(e.target.value)}
                isInvalid={false}
              />
            </Form.Group>
            <button
              onClick={() => sendChangeRequest()}
              className="btn btn-success"
              disabled={!validateSendRequest()}
            >
              Send Request
            </button>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-info"
          onClick={() => setShowRequestTimeChange(!showRequestTimeChange)}
        >
          Request a time-change
        </button>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimeStatsModal;
