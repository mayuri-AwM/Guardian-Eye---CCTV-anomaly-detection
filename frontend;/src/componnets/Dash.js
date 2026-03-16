import React from 'react'
import './dash.css'
import { Link } from "react-router-dom";
// import cctv from '../photos/cctv.png';
export default function Dash() {
  return (
    <div className="container1">

      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">

   <a className="navbar-brand logo" href="/">
           
          Guardian Eye
        </a>
          <button className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse">

            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
<li className="nav-item">
                <a className="nav-link" href="#working">How it works</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About us</a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact us</a>
              </li>

             <li className="nav-item">
  <Link className="nav-link login-btn" to="/login">
    Login 
  </Link>
   <Link className="nav-link login-btn" to="/Sign_in">
    Sign in
  </Link>
</li>
</ul>
          </div>
        </div>
      </nav>

    </div>
  )
}
