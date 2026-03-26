import { useEffect, useState, useRef, useCallback } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(5);
  const [sosMessages, setSosMessages] = useState([]);

  const alarmRef = useRef(new Audio("/alarm.mp3"));

  // ✅ FIXED LOCATION (FINAL)
  const FIXED_LOCATION = "https://maps.google.com/?q=18.60112757910701,73.73854802141446";

  // 🔊 PLAY ALARM
  const playAlarm = () => {
    const alarm = alarmRef.current;
    alarm.loop = true;
    alarm.currentTime = 0;
    alarm.play().catch(() => {});

    setLogs(prev => [...prev, "** ALARM ACTIVATED! **"]);
    setShowPopup(true);
    startTimer();
  };

  // ⏹ STOP ALARM
  const stopAlarm = () => {
    const alarm = alarmRef.current;
    alarm.pause();
    alarm.currentTime = 0;
  };

  // ⏳ TIMER
  const startTimer = () => {
    let count = 5;
    setTimer(count);

    const interval = setInterval(() => {
      count--;
      setTimer(count);

      if (count === 0) {
        clearInterval(interval);
        sendSOS();
      }
    }, 1000);
  };

  // 📡 SOS (FIXED LOCATION)
  const sendSOS = () => {

    const mapLink = FIXED_LOCATION;

    setSosMessages([
      "Sending emergency alert to nearest police, fire brigade and ambulance..."
    ]);

    setTimeout(() => {
      setSosMessages(prev => [
        ...prev,
        `Driver: ABC driver
Vehicle: GJ00 AZ1234

📍 View Location:
${mapLink}

⚠ Alert: Driver drowsiness detected`
      ]);
    }, 1500);

    setTimeout(() => {
      setSosMessages(prev => [
        ...prev,
        "Received. Dispatching nearest units immediately. Thank you."
      ]);
    }, 3000);

    // SEND TO BACKEND (EMAIL / SMS)
    fetch("http://localhost:5000/send-sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        location: mapLink
      })
    });
  };

  // 🚨 DROWSY FLOW
  const handleDrowsy = useCallback(() => {
    setLogs([]);
    setLogs(["Driver detected as sleeping..."]);

    setTimeout(() => setLogs(prev => [...prev, "Buzzing alarm in 3..."]), 0);
    setTimeout(() => setLogs(prev => [...prev, "Buzzing alarm in 2..."]), 1000);
    setTimeout(() => setLogs(prev => [...prev, "Buzzing alarm in 1..."]), 2000);
    setTimeout(() => playAlarm(), 3000);
  }, []);

  // 🔄 STATUS SYNC
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/status")
        .then(res => res.json())
        .then(data => {
          if (data.status === "DROWSY" && !alertTriggered) {
            setAlertTriggered(true);
            handleDrowsy();
          }

          if (data.status === "ACTIVE") {
            setAlertTriggered(false);
          }
        });
    }, 1000);

    return () => clearInterval(interval);
  }, [alertTriggered, handleDrowsy]);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "20px" }}>

      <h1 style={{ textAlign: "center", borderBottom: "2px solid red", paddingBottom: "10px" }}>
        Driver Drowsiness Alert System
      </h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

        {/* LEFT PANEL */}
        <div style={{ flex: 2 }}>

          <div style={cardStyle}>
            <h3>Driver Monitor</h3>
            <div style={cameraStyle}>
              <img
                src="http://localhost:5000/video_feed"
                alt="camera"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          <div style={cardStyle}>
            <h3>Status Alert</h3>
            {logs.map((log, i) => (
              <p key={i}>• {log}</p>
            ))}
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1 }}>

          {/* DRIVER INFO */}
          <div style={cardStyle}>
            <h3>Driver Info</h3>
            <p>👤 ABC driver</p>
            <p>🚗 GJ00 AZ1234</p>
            <p>
              📍{" "}
              <a href={FIXED_LOCATION} target="_blank" rel="noreferrer" style={{ color: "lightblue" }}>
                View Location
              </a>
            </p>
          </div>

          {/* SOS PANEL */}
          <div style={cardStyle}>
            <h3>Emergency SOS Message</h3>

            <div style={{
              maxHeight: "200px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column"
            }}>
              {sosMessages.map((msg, i) => (
                <div key={i} style={{
                  background: "#111",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  maxWidth: "80%",
                  alignSelf: i % 2 === 0 ? "flex-start" : "flex-end"
                }}>
                  <p style={{ whiteSpace: "pre-line" }}>{msg}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div style={popupOverlay}>
          <div style={popupBox}>
            <h2 style={{ color: "red" }}>⚠ DRIVER ALERT</h2>
            <p>Are you awake?</p>
            <p>Respond within: {timer}s</p>

            <button
              style={buttonStyle}
              onClick={() => {
                stopAlarm();
                setShowPopup(false);
                setLogs(prev => [...prev, "Driver confirmed awake."]);
              }}
            >
              YES, I'M AWAKE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STYLES */

const cardStyle = {
  border: "2px solid red",
  padding: "15px",
  marginBottom: "20px",
  boxShadow: "0 0 10px red"
};

const cameraStyle = {
  height: "250px",
  background: "#111",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popupOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.9)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const popupBox = {
  background: "#000",
  border: "2px solid red",
  padding: "30px",
  textAlign: "center",
  width: "300px"
};

const buttonStyle = {
  marginTop: "10px",
  padding: "10px",
  width: "100%",
  background: "red",
  color: "white",
  border: "none"
};

export default App;