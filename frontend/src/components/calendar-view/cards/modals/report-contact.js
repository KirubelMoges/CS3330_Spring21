import { useState } from "react";
import { Modal, Form } from "react-bootstrap";

const ReportContactModal = (props) => {
  const [selectedUser, setSelectedUser] = useState(undefined);

  const [users, setUsers] = useState([
    { username: "test1", userId: 1, exposure: false },
    { username: "test2", userId: 2, exposure: false },
    { username: "test3", userId: 3, exposure: false },
    { username: "test4", userId: 4, exposure: false },
  ]);

  const setExposure = (username) => {
    const newUsers = users.map((currUser) => {
      if (currUser.username == username) {
        currUser.exposure = true;
      }
      return currUser;
    });
    setUsers(newUsers);
  };
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Tracing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Select an employee that you have been in contact with.</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Employees:</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.userId}>{user.username}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-danger"
          onClick={() => {
            alert("Your manager will be notified.");
            setExposure(selectedUser);
            props.handleClose();
          }}
        >
          Report Contact
        </button>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportContactModal;
