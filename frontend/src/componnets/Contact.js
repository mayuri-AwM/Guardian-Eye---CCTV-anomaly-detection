import { useState, useRef } from "react";
import "./contact.css";
import emailjs from "@emailjs/browser";

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
     console.log("FORM SUBMITTED"); 
    emailjs
      .sendForm(
        "service_sxmnkdr",
        "template_hto4kpb",
        formRef.current,
        {
          publicKey: "0xu48dx_ZwtUckg32",
        }
      )
      .then(() => {
        setLoading(false);
        setSubmitted(true);
        setForm(INITIAL_FORM);
        setTimeout(() => setSubmitted(false), 5000);
      })
      .catch((error) => {
        setLoading(false);
        console.log("FAILED...", error.text);
      });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-sub">
        We'd love to hear from you. Send us your queries.
      </p>

      <form ref={formRef} onSubmit={sendEmail}>
        <div className="contact-box">

          <div className="contact-form">

            <div className="cf-row">
              <div className="cf-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="cf-field">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="cf-row">
              <div className="cf-field">
                <label>Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                />
              </div>

              <div className="cf-field">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="cf-field">
              <label>Message *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>


            <button
              type="submit"
              className="cf-submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {submitted && (
              <p style={{ color: "green", marginTop: "10px" }}>
                ✅ Message sent successfully!
              </p>
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
              🟢 All systems operational
            </div>
          </div>

        </div>
      </form>


    </div>
  );
}