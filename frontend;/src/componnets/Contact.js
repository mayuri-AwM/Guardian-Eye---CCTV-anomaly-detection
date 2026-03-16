import { useState } from "react";
import "./contact.css";

const QUERY_TYPES = [
  "Technical Issue",
  "Request Demo",
  "Sales / Pricing",
  "Integration Help",
  "False Positive Alert",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  org: "",
  subject: "",
  message: "",
};

function isFormValid(form) {
  return form.name.trim() && form.email.trim() && form.message.trim();
}

export default function Contact() {
  const [form, setForm]           = useState(INITIAL_FORM);
  const [activeChip, setActiveChip] = useState("Technical Issue");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!isFormValid(form)) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setActiveChip("Technical Issue");
      setTimeout(() => setSubmitted(false), 10000);
    }, 1400);
  };

  return (
    <div className="contact-container">

      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-sub">
       We'd love to hear from you. Send us your queries.
      </p>

      <div className="contact-box">

       
        <div className="contact-form">

          
          <div className="cf-row">
            <div className="cf-field">
              <label>Your Name <span className="cf-req">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>
            <div className="cf-field">
              <label>Email Address <span className="cf-req">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="cf-row">
            <div className="cf-field">
              <label>Organization</label>
              <input
                type="text"
                name="org"
                value={form.org}
                onChange={handleChange}
                placeholder="Company / Institution"
              />
            </div>
            <div className="cf-field">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief topic"
              />
            </div>
          </div>

      
          <div className="cf-field">
            <label>Query Type</label>
            <div className="cf-chips">
              {QUERY_TYPES.map((type) => (
                <div
                  key={type}
                  className={`cf-chip${activeChip === type ? " active" : ""}`}
                  onClick={() => setActiveChip(type)}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

      
          <div className="cf-field">
            <label>Message <span className="cf-req">*</span></label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Describe your issue or request in detail..."
            />
          </div>

         
          <button
            className="cf-submit"
            onClick={handleSubmit}
            disabled={loading || submitted}
          >
            {loading ? "Sending..." : submitted ? "Message Sent ✓" : "Send Message →"}
          </button>

          {submitted && (
            <div className="contact-success">
              <span>✓</span>
              <span>Message received! We'll get back to you within 24 hrs.</span>
            </div>
          )}
        </div>


        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>📧 mayurir2005@gmail.com</p>
          <p>📞 +91 9403781371</p>
         
   

          <div className="ci-divider" />

          <div className="ci-sla">
            <div className="ci-sla-item">
              <div className="ci-sla-label">Critical Issues</div>
              <div className="ci-sla-val">&lt; 2 hrs</div>
            </div>
            <div className="ci-sla-item">
              <div className="ci-sla-label">General Queries</div>
              <div className="ci-sla-val">24 hrs</div>
            </div>
          </div>

          <div className="ci-divider" />

          <div className="ci-status">
            <div className="ci-status-dot" />
            All systems operational
          </div>
        </div>

      </div>

     

    </div>
  );
}