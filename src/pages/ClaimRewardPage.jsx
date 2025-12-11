import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ClaimRewardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [message, setMessage] = useState("Processing your reward...");
  const [claiming, setClaiming] = useState(true);

  const query = new URLSearchParams(location.search);
  const binId = query.get("binId");

  const didRun = useRef(false); // 🔥 prevents double execution

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    if (loading) return;

    if (!binId) {
      setMessage("Invalid QR code.");
      setClaiming(false);
      return;
    }

    if (!user) {
      navigate("/login");
      return;
    }

    const claimReward = async () => {
      try {
        const res = await fetch("https://smartbin-backend-gptt.onrender.com/api/bin/claim", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            binId,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          setMessage(data.message || "Unable to claim reward.");
          setClaiming(false);
          return;
        }

        setMessage(`Success! You earned ${data.reward} points!`);

        setTimeout(() => {
          navigate("/history");
        }, 1500);

      } catch (err) {
        setMessage("Server error. Please try again.");
      } finally {
        setClaiming(false);
      }
    };

    claimReward();
  }, [loading, user, binId, navigate]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Reward Claim</h2>
      <p>{message}</p>
      {claiming && <p>Please wait...</p>}

      {/* ✅ BACK BUTTON */}
      {!claiming && (
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#1c807aff",
            color: "white",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Back to Dashboard
        </button>
      )}
    </div>
  );
}
