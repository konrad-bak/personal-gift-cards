import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import Login from './Components/Login';
import SignIn from './Components/SignIn/SignIn';
import TestComponent from './Components/TestComponent';

function App() {
  return (
    <>
      <Login />
      <TestComponent />
      <SignIn />
    </>
  );
}

export default App;
