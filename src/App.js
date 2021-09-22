import { Route } from 'react-router';
import { BluePage, RedPage, UsersPage } from './pages';
import { Menu } from './components';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
      <Route path="/users" component={UsersPage} />
    </div>
  );
}

export default App;
