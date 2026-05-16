import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkApiHealth, loginAdmin } from "./api";
import "./admin.css";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiOnline, setApiOnline] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkApiHealth().then(setApiOnline);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginAdmin(password);
      if (!data?.token) {
        setError("Login response invalid. Is the API server running?");
        return;
      }
      localStorage.setItem("maatridev-admin-token", data.token);
      onLogin(data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      const status = err.response?.status;
      if (!err.response) {
        setError(
          "Cannot reach the API on port 3001. Close this tab, run START-FULL.bat (or npm run dev), then try again."
        );
      } else if (status === 401) {
        setError(
          "Incorrect password. Use maatridev2026 by default, or the value in website/.env (ADMIN_PASSWORD)."
        );
      } else if (status === 502 || status === 504) {
        setError(
          "API server is not running. Run START-FULL.bat or npm run dev (not dev:client only)."
        );
      } else {
        setError(`Login failed (error ${status}). Run npm run dev and retry.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={handleSubmit}>
        <div className="admin-login__logo">M</div>
        <h1>Website Builder</h1>
        <p className="admin-login__sub">
          Password-protected CMS for MaatriDev Technologies — edit pages, upload media, and view contact
          messages.
        </p>

        {apiOnline === false && (
          <div className="alert alert--error">
            <strong>API offline.</strong> Start the backend: double-click <code>START-FULL.bat</code> or run{" "}
            <code>npm run dev</code> in the website folder.
          </div>
        )}
        {apiOnline === true && (
          <div className="alert alert--success admin-login__api-ok">
            API connected — you can sign in.
          </div>
        )}

        <div className="admin-login__features">
          <span><i className="fa-solid fa-lock" /> Secure login</span>
          <span><i className="fa-solid fa-wand-magic-sparkles" /> Page builder</span>
          <span><i className="fa-solid fa-images" /> Media library</span>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <div className="form-group">
          <label htmlFor="admin-password">Admin password</label>
          <div className="admin-login__password-wrap">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="admin-login__toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
            </button>
          </div>
          <p className="admin-login__hint">
            Default password: <code>maatridev2026</code> — change in <code>website/.env</code> →{" "}
            <code>ADMIN_PASSWORD=yourpassword</code>
          </p>
        </div>

        <button type="submit" className="btn btn--primary admin-login__submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in to Website Builder"}
        </button>

        <a href="/" className="admin-login__back">
          ← Back to public website
        </a>
      </form>
    </div>
  );
}
