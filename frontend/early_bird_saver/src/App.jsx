import logo from './logo.svg';
import './App.css';
import { Car } from "./Car"
import { People } from "./People"
import { Login } from './Login'
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/car' element={<Car />}></Route>
        <Route path='/people' element={<People />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
