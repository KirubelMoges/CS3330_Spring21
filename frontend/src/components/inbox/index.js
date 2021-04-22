import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { MessageRepository } from '../../api/messageRepository';

const Inbox = () => {
  const messagesRepository = new MessageRepository();

  const [allEmployeeMessages, setAllEmployeeMessages] = useState(undefined);

  useEffect(() => {
    if (!allEmployeeMessages) {
      messagesRepository.getAllEmployeeMessages().then((res) => {
        console.log('MESSAGES', res);
        setAllEmployeeMessages(res);
      });
    }
  }, [a]);

  return (
    <div className="container">
      {/* Use a table here..... */}
      {allEmployeeMessages &&
        allEmployeeMessages.map((message, index) => {
          return <div key={index}>message.content</div>;
        })}
      {a && <Table></Table>}
    </div>
  );
};

export default Inbox;
