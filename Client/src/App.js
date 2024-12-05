import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/signin" element={ <SignIn/> } />
        <Route path='/signup' element={ <SignUp/> } />
      </Routes>
    </div>
  );
}

export default App;
