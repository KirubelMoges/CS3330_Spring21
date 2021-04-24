import React, { useContext } from 'react';
import EmployeeView from './employee-view';
import ManagerView from './manager-view';
import Header from '../header';
import { UserContext } from '../../common/context';
import { UserTypes } from '../../utils/constants';

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
