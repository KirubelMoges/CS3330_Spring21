import React, { useContext } from 'react';
import Header from '../header';
import { UserContext } from '../../utils/context';
import { UserTypes } from '../../utils/constants';
import Calendar from './calendar/index';

const ManagerView = () => {
  return (
    <>
      <Calendar manager={true} />
    </>
  );
};

const EmployeeView = () => {
  return <Calendar manager={false} />;
};

const CalendarView = () => {
  const [userContext] = useContext(UserContext);
  const currentUserStatus = userContext.role ?? UserTypes.employee;
  const isManager = currentUserStatus === UserTypes.manager;

  return (
    <>
      <Header />
      {isManager ? <ManagerView /> : <EmployeeView />}
    </>
  );
};

export default CalendarView;
