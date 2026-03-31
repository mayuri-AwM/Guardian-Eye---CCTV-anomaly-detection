import React from "react";
import "./sign.css";
import bg from "../photos/bg.png";  
import { useNavigate } from "react-router-dom";
export default function Sign_in() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would normally add your registration logic (API calls, etc.)
    
    // Redirect to login
    navigate("/login");
  };
  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="glass-form">

        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>

          <input type="text" placeholder="Full Name" required />

          <input type="email" placeholder="Email Address" required />

          <input type="tel" placeholder="Phone Number" required />

          <input type="text" placeholder="Location" required />

          <input type="text" placeholder="Occupation" required />

          <input type="password" placeholder="Password" required />

          <input type="password" placeholder="Confirm Password" required />

          <button type="submit">Create Account</button>

          <p className="login-text">
            Already have an account? <a href="/login" >Login</a>
          </p>

        </form>

      </div>

    </div>
  );
}