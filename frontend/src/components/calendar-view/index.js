import React, { useContext } from 'react';
import EmployeeView from './employee-view';
import ManagerView from './manager-view';
import Header from '../header';
import { UserContext } from '../../common/context';

const CalendarView = () => {
  const [userContext] = useContext(UserContext);
  const currentUserStatus = userContext.role ?? 'employee';
  const status = currentUserStatus === 'manager' ? 'MANAGER' : 'EMPLOYEE';

  return (
    <>
      <Header />
      {status === 'EMPLOYEE' ? <EmployeeView /> : <ManagerView />}
    </>
  );
};

export default CalendarView;
