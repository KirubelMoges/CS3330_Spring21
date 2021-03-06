import { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { MessageRepository } from '../../../api/messageRepository';
import Header from '../../header';

const Inbox = () => {
  const messagesRepository = new MessageRepository();

  const [allEmployeeMessages, setAllEmployeeMessages] = useState(undefined);

  useEffect(() => {
    if (!allEmployeeMessages) {
      messagesRepository.getAllEmployeeMessages().then((res) => {
        if (res[1].success === true) {
          setAllEmployeeMessages(res[0].data);
        } else setAllEmployeeMessages([]);
      });
    }
  }, [allEmployeeMessages]);

  return (
    <>
      <Header />
      <div className="container">
        {/* Use a table here..... */}
        {allEmployeeMessages &&
          allEmployeeMessages.map((message, index) => {
            return <div key={index}>{message.message}</div>;
          })}
        {allEmployeeMessages && <Table></Table>}
      </div>
    </>
  );
};

export default Inbox;
