import React from "react";
import { Route, Routes } from "react-router-dom";
//import { Counter } from './features/counter/Counter';
import "./App.css";
import Cweb from "./Components/Cweb";
import Dashboard from "./Components/Dashboard";
import DrivingRoute from "./Components/DrivingRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Cweb />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/driving-route" element={<DrivingRoute />} />
      </Routes>
    </div>
  );
}

export default App;
