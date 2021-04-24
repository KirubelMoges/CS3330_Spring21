import { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { UserRepository } from "../../../../api/userRepository";

const ReportContactModal = (props) => {
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [users, setUsers] = useState(undefined);

  useEffect(() => {
    const userRepository = new UserRepository();
    if (users === undefined) {
      userRepository.getAllUsers().then((data) => {
        if (data[1].success === true) {
          setUsers(data[0].data);
          console.log(data);
        } else {
          setUsers([]);
        }
      });
    }
  });

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Tracing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Select an employee that you have been in contact with.</p>
        {users && (
          <Form>
            <Form.Group controlId="scheduleForm.room">
              <Form.Label>Employees:</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.userId}>
                    {user.firstName} {user.lastName} - {user.userEmail}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-danger"
          onClick={() => {
            alert("Your manager will be notified.");
            let formResponse = selectedUser.split(" ");
            props.reportContact(
              users.find((x) => {
                return x.userEmail == formResponse[3];
              })
            );
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
