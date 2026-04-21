import { useState, useRef } from "react";
import "./contact.css";
import emailjs from "@emailjs/browser";

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
  query_type: "",
};

function isFormValid(form) {
  return form.name.trim() && form.email.trim() && form.message.trim();
}

export default function Contactuser() {
  const [form, setForm]             = useState(INITIAL_FORM);
  const [activeChip, setActiveChip] = useState("Technical Issue");
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const formRef                     = useRef();          // ✅ added

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // ✅ Single sendEmail — lives inside the component so it has access to state & formRef
  const sendEmail = (e) => {
    e.preventDefault();
    if (!isFormValid(form)) return;
    setLoading(true);

    emailjs
      .sendForm(
        "service_rcji9ok",
        "template_i21i5ia",
        formRef.current,
        "SjRxxS5BXyYd4DYoz"
      )
      .then(() => {
        setLoading(false);
        setSubmitted(true);
        setForm(INITIAL_FORM);
        setActiveChip("Technical Issue");
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((error) => {
        setLoading(false);
        console.error("EmailJS error:", error);
      });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-sub">
        We'd love to hear from you. Send us your queries.
      </p>

      <div className="contact-box">
        {/* ✅ attach formRef here and use sendEmail as the submit handler */}
        <form className="contact-form" ref={formRef} onSubmit={sendEmail}>

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

          {/* hidden input so emailjs picks up the selected chip */}
          <input type="hidden" name="query_type" value={activeChip} />

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
            type="submit"
            className="cf-submit"
            disabled={loading || submitted || !isFormValid(form)}
          >
            {loading ? "Sending..." : submitted ? "Message Sent ✓" : "Send Message →"}
          </button>

          {submitted && (
            <div className="contact-success">
              <span>✓</span>
              <span>Message received! We'll get back to you within 24 hrs.</span>
            </div>
          )}
        </form>

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