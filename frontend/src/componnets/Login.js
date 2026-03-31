import React, { useState } from "react";
import "./login.css";
import bg from "../photos/bg.png";
import { useNavigate } from "react-router-dom";
export default function Login() {
const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailPattern.test(value)) setEmailError(false);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length >= 1) setPasswordError(false);
  };

  const validateEmail = () => {
    if (!emailPattern.test(email)) setEmailError(true);
  };

  const validatePassword = () => {
    if (password.length < 1) setPasswordError(true);
  };

  // 3. Create the handleLogin function
  const handleLogin = () => {
    const isEmailValid = emailPattern.test(email);
    const isPasswordValid = password.length >= 1;

    if (isEmailValid && isPasswordValid) {
  localStorage.setItem("token", "logged-in");       // ← save token
  localStorage.setItem("username", "Rahul");         // ← save username
  navigate("/logindash");                            // ← redirect
} else {
      // If invalid, show errors
      if (!isEmailValid) setEmailError(true);
      if (!isPasswordValid) setPasswordError(true);
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="login-card">

        <h2>Welcome Back</h2>
        <p>Login to your account to continue</p>

        {/* Email */}
        <div className="input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            onBlur={validateEmail}
            className={emailError ? "error-border" : ""}
          />
          {emailError && <span className="error-icon">!</span>}
        </div>

        {/* Password */}
        <div className="input-group">
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={validatePassword}
            className={passwordError ? "error-border" : ""}
          />
          {passwordError && <span className="error-icon">!</span>}
        </div>

        <button onClick={handleLogin}>Login</button>

      </div>
    </div>
  );
}