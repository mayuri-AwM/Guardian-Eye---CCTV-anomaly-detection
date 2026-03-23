import React from 'react'
import bg from '../photos/bg.png';
import './dashboard.css';
import Working from './Working';
import Contact from './Contact';
import About from './About';
import Footer from './Footer';
import Upload from './Upload';




export default function Dashboard() {
  return(
 <div className="container2">

{/* HERO SECTION */}
<div
  className='hero'
  style={{
    id:"dashboard",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100vh",
    width: "100%",
    display: "flex",
    
    alignItems: "center",
    justifyContent: "flex-end",
  }}
>

  <div style={{
    width: "40%",
    marginRight: "20px",
    color: "white",
    textAlign: "left"
  }}>

    <h1 style={{ marginTop: "-120px",fontSize: "40px" }}>
      CCTV ANAMOLY DETECTION
    </h1>

    <p style={{ marginTop: "40px",marginBottom:"40px", fontSize: "16px" }}>
      Monitor your CCTV cameras with AI-powered intelligence.
      Detect suspicious activities and receive real-time alerts instantly.
      Stay aware, respond faster, and maintain a safer environment.
    </p>

    <div className='btn-dash'>
      <button>Get Started</button>
      <button>Learn More</button>
    </div>

  </div>

</div>



<div id="working" style={{ margin: 0, padding: 0, display: 'block' }}>
  <Working />
</div>
<div id="about" style={{ margin: 0, padding: 0, display: 'block' }}>
<About/>
</div>
<div id="contact" style={{ margin: 0, padding: 0, display: 'block' }}>
<Contact/>
</div>
<div id="upload" style={{ margin: 0, padding: 0, display: 'block' }}>
<Upload/>
</div>
<div id="footer" style={{ margin: 0, padding: 0, display: 'block' }}>
<Footer/>
</div>


</div>
  )
}