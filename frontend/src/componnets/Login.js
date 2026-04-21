import React, { useState } from "react";
import "./login.css";
import bg from "../photos/bg.png";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase";
import { getAuth, signInWithEmailAndPassword ,sendPasswordResetEmail} from "firebase/auth";

const auth = getAuth(app);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email address first.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      alert("No account found with this email.");
    } else {
      alert(error.message);
    }
  }
};
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // define user FIRST

      if (!user.emailVerified) {
        alert("Email not verified. Please check your inbox and verify your email first.");
        return;
      }

      const username = user.displayName || user.email.split("@")[0];
      localStorage.setItem("username", username);
      navigate("/logindash");

    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("User not found. Please signup.");
      } else if (error.code === "auth/wrong-password") {
        alert("Wrong password.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email.");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p>Login to your account to continue</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="forgot" onClick={handleForgotPassword} style={{ cursor: "pointer", color: "#4fc3f7" }}>
  Forgot Password?
</p>
          <button type="submit">Login</button>
        </form>

        <p className="sign">
          Don't have an account? <a href="/sign_in">Sign Up</a>
        </p>
      </div>
    </div>
  );
}