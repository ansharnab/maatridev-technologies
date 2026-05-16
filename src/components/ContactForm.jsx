import { useState } from "react";
import axios from "axios";

export default function ContactForm({ compact = false }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await axios.post("/api/contact", form);
      setStatus({ type: "success", message: data.message });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.error || "Submission failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`contact-form ${compact ? "contact-form--compact" : ""}`} onSubmit={handleSubmit}>
      {status && <div className={`alert alert--${status.type}`}>{status.message}</div>}
      <div className={compact ? "" : "grid-2"}>
        <div className="form-group">
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
      </div>
      {!compact && (
        <div className="grid-2">
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" value={form.subject} onChange={handleChange} />
          </div>
        </div>
      )}
      <div className="form-group">
        <label>Message *</label>
        <textarea name="message" rows={compact ? 4 : 6} value={form.message} onChange={handleChange} required />
      </div>
      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Sending…" : "Send Message"}
        <i className="fa-solid fa-paper-plane" />
      </button>
    </form>
  );
}
