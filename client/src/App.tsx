import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useSelector } from 'react-redux';
import './App.css';
import Login from './Components/Login';
import SignIn from './Components/SignIn/SignIn';
import TestComponent from './Components/TestComponent';
import UserCards from './Components/UserCards/UserCards';
import { RootState } from './redux/store';

function App() {
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      <Login />
      <TestComponent />
      {!user.isLoggedIn ? <SignIn /> : <UserCards />}
    </>
  );
}

export default App;
