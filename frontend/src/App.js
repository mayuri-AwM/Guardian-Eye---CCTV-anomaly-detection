import './App.css';
import Dash from "./componnets/Dash";
import Dashboard from './componnets/Dashboard';
import Login from './componnets/Login';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sign_in from './componnets/Sign_in';


function App() {
  return (
    <BrowserRouter>

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

        <Route path="/sign_in" element={<Sign_in />} />

      </Routes>

    </BrowserRouter>
    
  );
}

export default App;