import logo from './logo.svg';
import './App.css';
import openai from "./images/openai.svg";
import { Routes, Route } from 'react-router-dom';
import CreateImage from './imageComponents/create';
import Community from './imageComponents/community';
import Signup from './authcomponents/signup';
import Base from './authcomponents/base';
import Login from './authcomponents/login';
import ForgotPassword from './authcomponents/forgotPassword';
import UpdatePassword from './authcomponents/updatePassword';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Base/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/:id/:token' element={<UpdatePassword/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/create-image' element={<CreateImage/>}/>
        <Route path='/community/posts' element={<Community/>}/>
      </Routes>
      
    </div>
  );
}

export default App;
