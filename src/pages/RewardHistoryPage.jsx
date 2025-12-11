import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RewardHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`https://smartbin-backend-gptt.onrender.com/api/history/${user._id}`);
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="wide-container">
      <div className="card">
        {/* Top section with title + back button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Reward History</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
            style={{ width: "auto", padding: "8px 14px" }}
          >
            ← Back
          </button>
        </div>

        {/* Reward list */}
        {history.length === 0 ? (
          <p>No rewards claimed yet.</p>
        ) : (
          <div className="reward-list">
            {history.map((item) => (
              <div className="reward-card" key={item._id}>
                <div className="reward-left">
                  <div className="reward-bottles">
                    {item.bottles} bottles
                  </div>
                  <div className="reward-bin">
                    From bin <strong>{item.binId}</strong>
                  </div>
                </div>

                <div className="reward-date">
                  {new Date(item.date).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
