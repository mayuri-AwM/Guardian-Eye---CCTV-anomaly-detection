import React, { useState } from "react";
import "./login.css";
import bg from "../photos/bg.png";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // remove error immediately if valid
    if (emailPattern.test(value)) {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // remove error immediately if valid
    if (value.length >= 6) {
      setPasswordError(false);
    }
  };

  const validateEmail = () => {
    if (!emailPattern.test(email)) {
      setEmailError(true);
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError(true);
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

        <button>Login</button>

      </div>
    </div>
  );
}