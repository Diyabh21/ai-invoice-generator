import { useState } from "react";
import { DB, uid } from "../utils/helpers";

export default function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const user = DB.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      setError("Invalid email or password.");
      return;
    }
    onLogin(user);
  };

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (DB.users.find((u) => u.email === email)) {
      setError("Email already registered.");
      return;
    }
    const user = { id: uid(), email, password, name };
    DB.users.push(user);
    onLogin(user);
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">Invoicer</div>
        <div className="auth-tagline">Professional Invoice Builder</div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "active" : ""}`}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "active" : ""}`}
            onClick={() => {
              setTab("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        {tab === "register" && (
          <div className="auth-field">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or business"
            />
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (tab === "login" ? handleLogin() : handleRegister())
            }
          />
        </div>

        {error && <div className="auth-error">⚠ {error}</div>}

        <button
          className="auth-submit"
          onClick={tab === "login" ? handleLogin : handleRegister}
        >
          {tab === "login" ? "Sign In →" : "Create Account →"}
        </button>

        {tab === "login" && (
          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "var(--muted)",
              letterSpacing: "0.08em",
            }}
          >
            Demo: demo@example.com / demo1234
          </div>
        )}
      </div>
    </div>
  );
}
