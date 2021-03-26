import HomePage from './components/home';
import Login from './components/auth/login';
import { Route, BrowserRouter as Router } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/login" component={Login} />
    </Router>
  );
};

export default App;
