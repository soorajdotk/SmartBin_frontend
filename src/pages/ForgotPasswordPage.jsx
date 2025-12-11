import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch("https://smartbin-backend-gptt.onrender.com/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setInfo("OTP sent to your email.");
        // store email temporarily for next page
        localStorage.setItem("resetEmail", email);

        // small delay for user feedback
        setTimeout(() => {
          navigate("/verify-otp");
        }, 700);
      } else {
        setError(data.message || "Failed to send email");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2 style={{ textAlign: "center", marginBottom: "16px", color: "#008080" }}>
          Forgot Password?
        </h2>
        <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "20px", color: "#6c757d" }}>
          Enter your registered email to receive an OTP.
        </p>

        <form onSubmit={handleSend}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {info && <div className="success">{info}</div>}
        {error && <div className="error">{error}</div>}

        <p style={{ textAlign: "center", marginTop: "12px" }}>
          <a href="/login">Back to Login</a>
        </p>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
