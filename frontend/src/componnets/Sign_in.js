import React, { useState } from "react";
import "./sign.css";
import bg from "../photos/bg.png";  
import { useNavigate } from "react-router-dom";

export default function Sign_in() {
  const navigate = useNavigate();

  // ✅ state for inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ simple validation
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // 🔥 STORE USERNAME HERE
    localStorage.setItem("username", name);

    // optional token
    localStorage.setItem("token", "registered");

    // 👉 redirect to dashboard (or login if you want)
    navigate("/logindash"); 
    // OR: navigate("/login");
  };

  return (
    <div
      className="signup-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="glass-form">

        <h1>Create Account</h1>

        <form onSubmit={handleSubmit}>

          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />

          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />

          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />

          <input 
            type="text" 
            placeholder="Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required 
          />

          <input 
            type="text" 
            placeholder="Occupation" 
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />

          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />

          <button type="submit">Create Account</button>

          <p className="login-text">
            Already have an account? <a href="/login">Login</a>
          </p>

        </form>

      </div>

    </div>
  );
}