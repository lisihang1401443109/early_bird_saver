import logo from './logo.svg';
import './App.css';
import { Driver } from "./Driver"
import { People } from "./People"
import { Login } from './Login'
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/Driver' element={<Driver />}></Route>
        <Route path='/People' element={<People />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
