import "./footer.css";

const LINKS = [
  {
    heading: "Navigation",
    items: [
      { label: "Home",           id: "dashboard"    },
    
      { label: "Contact Us",     id: "contact" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Login",          id: "login"   },
      { label: "Sign Up",        id: "signup"  },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Privacy Policy",    id: "privacy" },
      { label: "Terms of Service",  id: "terms"   },
    ],
  },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

// ─── Smooth scroll helper ─────────────────────────
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  return (
    <footer className="ft-footer">
      {/* scan line */}
      <div className="ft-scanline" />

      <div className="ft-inner">

        {/* ── Brand col ─────────────────────────────── */}
        <div className="ft-brand">
          <div className="ft-logo">
            <div className="ft-logo-dot" />
            Guardian Eye
          </div>
          <p className="ft-tagline">
            AI-powered CCTV anomaly detection.<br />
            Smarter security, in real time.
          </p>
          <div className="ft-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-social-btn"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
          <div className="ft-status">
            <div className="ft-status-dot" />
            All systems operational
          </div>
        </div>

   
        {LINKS.map((col) => (
          <div className="ft-col" key={col.heading}>
            <div className="ft-col-heading">{col.heading}</div>
            <ul className="ft-col-list">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={`#${item.id}`}
                    className="ft-link"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(item.id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}


        <div className="ft-col ft-newsletter">
          <div className="ft-col-heading">Stay Updated</div>
          <p className="ft-newsletter-text">
            Get alerts on new features and security updates.
          </p>
          <div className="ft-newsletter-row">
            <input
              type="email"
              className="ft-newsletter-input"
              placeholder="your@email.com"
            />
            <button className="ft-newsletter-btn">→</button>
          </div>
        </div>

      </div>

      <div className="ft-bottom">
        <span className="ft-copy">
          © {new Date().getFullYear()} Guardian Eye. All rights reserved.
        </span>
        <div className="ft-bottom-links">
          <a
            href="#privacy"
            className="ft-bottom-link"
            onClick={(e) => { e.preventDefault(); scrollTo("privacy"); }}
          >
            Privacy
          </a>
          <a
            href="#terms"
            className="ft-bottom-link"
            onClick={(e) => { e.preventDefault(); scrollTo("terms"); }}
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}