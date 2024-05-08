// import React from "react";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="/Home" element={<Home/>}></Route> 
        <Route path="/EditProfile" element={<EditProfile/>}></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
