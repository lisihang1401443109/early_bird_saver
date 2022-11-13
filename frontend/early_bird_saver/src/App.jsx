import logo from './logo.svg';
import './App.css';
import { Car } from "./Car"
import { People } from "./People"
import { Login } from './Login'
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
        integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
        crossorigin=""/>
      <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
        integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
        crossorigin=""></script>
    </head>
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
