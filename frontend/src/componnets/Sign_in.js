import React, { useState } from "react";
import "./sign.css";
import bg from "../photos/bg.png";  
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { app } from "../Firebase";


import { doc, setDoc } from "firebase/firestore";

import { db } from "../Firebase";
const auth = getAuth(app);
export default function Sign_in() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



const handleSubmit = async (e) => {
  e.preventDefault();


  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    //Create user in Firebase Auth (stores email + password)
  
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
          const user = userCredential.user;
await sendEmailVerification(user);
alert("Verification email sent! Please check your inbox and verify before logging in.");
navigate("/login"); // send to login instead of dashboard

     await updateProfile(user, {
      displayName: name,
    });
    // Store extra user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      phone: phone,
      location: location,
      occupation: occupation,
      createdAt: new Date()
    });

    // 💾 optional local storage
    localStorage.setItem("username", name);
    localStorage.setItem("token", "registered");

    // 🚀 redirect after success
    navigate("/logindash");

  } catch (error) {
    console.log(error.code);

    if (error.code === "auth/email-already-in-use") {
      alert("Email already registered. Please login.");
    } else if (error.code === "auth/network-request-failed") {
      alert("Network error. Try different internet.");
    } else {
      alert(error.message);
    }
  }
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

          <button type="submit" >Create Account</button>

          <p className="login-text">
            Already have an account? <a href="/login">Login</a>
          </p>

        </form>

      </div>

    </div>
  );
}