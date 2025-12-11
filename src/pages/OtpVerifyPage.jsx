import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyOTPPage = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { completeOtpLogin } = useAuth(); // ⬅ import from AuthContext

  // Read email stored from Forgot Password page
  const email = localStorage.getItem("resetEmail");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !otp) {
      setError("Email & OTP required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://smartbin-backend-gptt.onrender.com/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // ⬅ Call AuthContext method (this logs the user in)
        completeOtpLogin(
          data.accessToken,
          data.refreshToken,
          data.user,
          true // remember user
        );

        // Clear stored email
        localStorage.removeItem("resetEmail");

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">

        <h2 style={{ textAlign: "center", marginBottom: "10px", color: "#008080" }}>
          Enter OTP
        </h2>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6c757d" }}>
          A 6-digit OTP was sent to <br />
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <input
              type="text"
              maxLength="6"
              value={otp}
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {error && (
          <div className="error" style={{ textAlign: "center" }}>
            {error}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          <a href="/login">Back to Login</a>
        </p>

      </div>
    </div>
  );
};

export default VerifyOTPPage;
