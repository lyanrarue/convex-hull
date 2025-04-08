import './App.css';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './features/NavigationBar/NavigationBar';
import Home from './features/Home/Home';
import Aide from './features/Aide/Aide';
import { RecoilRoot } from 'recoil';

/**
 * The parent React component for the entire application. Contains all routing 
 * logic and defines basic website layout.
 * @returns The basic website layout
 */
const App = () => {
  return (
    <RecoilRoot>
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/home" component={Home} />
        <Route path="/aide" component={Aide} />
        <Route path="/" component={Home} />
      </Switch>
    </Router>
    </RecoilRoot>
  );
}

export default App;
