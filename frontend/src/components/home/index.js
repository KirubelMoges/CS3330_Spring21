import { useEffect, useState, useContext } from "react";
import { Spinner } from "react-bootstrap";
import LandingPage from "../landing";
import CalendarView from "../calendar-view";
import { UserRepository } from "../../api/userRepository";
import { UserContext } from "../../common/context";

const LoggedInView = () => {
  return <CalendarView />;
};

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [, setUserContext] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const userRepository = new UserRepository();
    const getUser = () => {
      userRepository
        .getMoreUserInformationById(userRepository.currentUser().userId, true)
        .then(() => {
          setUserContext(userRepository.currentUser());
          setIsLoading(false);
        });
    };
    const isLoggedIn = userRepository.loggedIn();
    if (
      (isLoggedIn && !userRepository.currentUser().officeId) ||
      !userRepository.currentUser().covidStatus ||
      !userRepository.currentUser().role ||
      userRepository.currentUser().covidStatus == null
    )
      getUser();
    setLoggedIn(isLoggedIn);
  }, [loggedIn, setLoggedIn, setUserContext]);

  if (loggedIn && isLoading) {
    return (
      <div className="row">
        <div className="col">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loadisng...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
