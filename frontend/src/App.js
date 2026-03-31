import './App.css';
import Dash from "./componnets/Dash";
import Dashboard from './componnets/Dashboard';
import Login from './componnets/Login';
import { Routes, Route } from "react-router-dom";
import Sign_in from './componnets/Sign_in';
import Upload from './componnets/Upload';
import Login_dash from './componnets/Login_dash';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Dash />
            <Dashboard />
          </>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/sign_in" element={<Sign_in />} />
      <Route path="/logindash" element={<Login_dash />} />
    </Routes>
  );
}

export default App;