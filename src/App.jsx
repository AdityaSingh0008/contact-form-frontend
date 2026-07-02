import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://contact-form-backend-wt52.onrender.com/api/health";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear the field error as the user edits it
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setErrors({});

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.errors) {
          const fieldErrors = {};
          data.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        }
        setStatus("error");
        setStatusMessage(data.message || "Something went wrong.");
        return;
      }

      setStatus("success");
      setStatusMessage(data.message || "Message sent successfully!");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setStatusMessage("Could not reach the server. Please try again later.");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Get in touch</h1>
        <p className="subtitle">We'd love to hear from you.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your name" />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="subject">Subject (optional)</label>
            <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
            {errors.subject && <span className="error">{errors.subject}</span>}
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="5" value={form.message} onChange={handleChange} placeholder="Tell us more..." />
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Send message"}
          </button>

          {statusMessage && (
            <p className={status === "success" ? "status success" : "status error"}>{statusMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
}
