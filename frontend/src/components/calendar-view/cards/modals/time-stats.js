import { Modal } from 'react-bootstrap';

const TimeStatsModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Time Stats</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Here is the breakdown of your time:</p>
        <p>Time today: 3hrs</p>
        <p>Time this week: 22hrs</p>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TimeStatsModal;
