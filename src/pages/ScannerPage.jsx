import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { BrowserQRCodeReader } from "@zxing/library";
import { FaArrowLeft, FaCamera, FaRedo } from "react-icons/fa";

const ScannerPage = () => {
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const webcamRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const navigate = useNavigate();

  const capture = useCallback(async () => {
    if (!scanning || !webcamRef.current) return;

    const img = webcamRef.current.getScreenshot();
    if (!img) return;

    try {
      const result = await codeReader.current.decodeFromImageUrl(img);

      if (result) {
        setScanning(false);

        let qrText = result.getText();
        let binId = null;

        console.log("RAW QR:", qrText);

        // Case 1: URL QR → extract ?binId=RVM_CAMERA_01
        try {
          const url = new URL(qrText);
          binId = url.searchParams.get("binId");
        } catch {
          // Case 2: plain text QR → treat entire text as binId
          binId = qrText;
        }

        console.log("FINAL binId:", binId);

        if (!binId) {
          setError("Invalid QR Code: No binId found.");
          return;
        }

        setSuccess(`QR Code detected: ${binId}`);

        // Redirect to claim page
        setTimeout(() => navigate(`/claim?binId=${binId}`), 800);
      }
    } catch {}
  }, [scanning, navigate]);

  React.useEffect(() => {
    if (scanning) {
      const interval = setInterval(capture, 400);
      return () => clearInterval(interval);
    }
  }, [scanning, capture]);

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>QR Code Scanner</h2>
          <button onClick={() => navigate("/dashboard")} className="btn btn-secondary">
            <FaArrowLeft /> Back
          </button>
        </div>

        {scanning && (
          <>
            <div className="scanner-instructions">
              <FaCamera /> Scan the bin QR code
            </div>

            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }}
              style={{ width: "100%", maxWidth: "300px", borderRadius: "8px" }}
            />
          </>
        )}

        {success && <p style={{ textAlign: "center" }}>✅ {success}</p>}
        {error && (
          <p style={{ textAlign: "center", color: "red" }}>
            ❌ {error}
            <br />
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <FaRedo /> Retry
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default ScannerPage;
