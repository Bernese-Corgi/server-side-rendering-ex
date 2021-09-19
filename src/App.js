import { Route } from 'react-router';
import { BluePage, RedPage } from './pages';
import { Menu } from './components';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
    </div>
  );
}

export default App;
