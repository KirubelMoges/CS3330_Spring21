import React from 'react';
import EmployeeView from './employee-view';
import ManagerView from './manager-view';
import Header from '../header';

const CalendarView = () => {
  const status = 'EMPLOYEE';

  return (
    <div>
      <Header />
      {status === 'EMPLOYEE' ? <EmployeeView /> : <ManagerView />}
    </div>
  );
};

export default CalendarView;
