import React, { useState } from 'react';
import ReportCovidModal from './modals/report-covid';
import ReportContactModal from './modals/report-contact';
import { UserRepository } from '../../../api/userRepository';
import { EmployeeRepository } from '../../../api/employeeRepository';

export const CovidCard = () => {
  const [isReportCovidModalShowing, setIsReportCovidModalShowing] = useState(false);
  const handleReportCovidClose = () => setIsReportCovidModalShowing(false);
  const handleReportCovidOpen = () => setIsReportCovidModalShowing(true);

  const [isReportContactModalShowing, setIsReportContactModalShowing] = useState(false);
  const handleReportContactClose = () => setIsReportContactModalShowing(false);
  const handleReportContactOpen = () => setIsReportContactModalShowing(true);

  const userRepository = new UserRepository();

  const [hasCovid, setHasCovid] = useState(
    userRepository.currentUser().covidStatus === 1 ? true : false
  );

  const covidReported = () => {
    setHasCovid(true);
    userRepository.editCovidStatus(userRepository.currentUser().userId, 1).then(() => {});
  };

  const contactReported = (reportedUser) => {
    const employeeRepository = new EmployeeRepository();
    employeeRepository
      .reportContact(reportedUser.userId, userRepository.currentUser().userId, '')
      .then(() => {
        employeeRepository.setExposure(reportedUser.userId).then();
      });
  };

  return (
    <div className="col mt-3">
      <div className="covidcard shadow">
        <div className=" clock-card">
          <div className="card-body">
            <h5 className="text-center">COVID-19</h5>
            <p className="card-text text-center">Report Covid or Contact Trace.</p>
            <div className="d-flex flex-row justify-content-center">
              <div className="d-flex flex-column">
                {hasCovid ? (
                  <button className="btn btn-warning text-light" onClick={handleReportContactOpen}>
                    Report Contact
                  </button>
                ) : (
                  <button className="btn btn-danger mb-2" onClick={handleReportCovidOpen}>
                    Report Covid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <ReportCovidModal
          handleClose={handleReportCovidClose}
          show={isReportCovidModalShowing}
          reportCovid={covidReported}
        />
        <ReportContactModal
          handleClose={handleReportContactClose}
          show={isReportContactModalShowing}
          reportContact={contactReported}
        />
      </div>
    </div>
  );
};
