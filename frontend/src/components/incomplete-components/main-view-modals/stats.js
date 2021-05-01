import { Modal } from 'react-bootstrap';

const StatsModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Covid Stats</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Understand how covid affects your workplace. Information about breakouts and the current
        state of your office will be found here once an infection has been reported.
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default StatsModal;
