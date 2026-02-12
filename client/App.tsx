import { useEffect, useState } from "react";

function App() {
  const [metrics, setMetrics] = useState({
    totalShifts: 0,
    missedShifts: 0,
    complianceViolations: 0,
    riskScore: 100
  });

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/api/metrics/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const sendEvent = async (type: string) => {
    await fetch("http://localhost:3001/api/metrics/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type })
    });
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>OptiSchedule Pro — Live Dashboard</h1>

      <h2>Real-Time Metrics</h2>
      <p><strong>Total Shifts:</strong> {metrics.totalShifts}</p>
      <p><strong>Missed Shifts:</strong> {metrics.missedShifts}</p>
      <p><strong>Compliance Violations:</strong> {metrics.complianceViolations}</p>
      <p><strong>Trust Score:</strong> {metrics.riskScore}</p>

      <hr />

      <h3>Simulate Events</h3>

      <button onClick={() => sendEvent("shift_completed")} style={{ marginRight: "10px" }}>
        Complete Shift
      </button>

      <button onClick={() => sendEvent("shift_missed")} style={{ marginRight: "10px" }}>
        Missed Shift
      </button>

      <button onClick={() => sendEvent("compliance_violation")}>
        Compliance Violation
      </button>
    </div>
  );
}

export default App;
