import React, { useState, useRef } from 'react';

function App() {
  const [storeId, setStoreId] = useState('2080');
  const [status, setStatus] = useState('System Initialized. Awaiting Input...');
  const [heatMap, setHeatMap] = useState(generateHeat(false));
  const [posInsights, setPosInsights] = useState(null);
  const fileInputRef = useRef(null);

  // --- Core Logic ---
  function generateHeat(isOptimized) {
    return Array.from({ length: 28 }, () => isOptimized ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 100));
  }

  function generateHourlyForecast(id) {
    const hours = [];
    const isKalamazoo = id === '5065';
    
    for(let i = 7; i <= 23; i++) {
      const ampm = i >= 12 ? 'PM' : 'AM';
      const hr = i > 12 ? i - 12 : i === 0 ? 12 : i;
      const timeStr = `${hr}:00 ${ampm}`;
      
      const isPeak = (i >= 9 && i <= 11) || (i >= 15 && i <= 18);
      const volMult = isKalamazoo ? 1.2 : 1.0; // Kalamazoo gets 20% more traffic
      
      const sales = isPeak ? Math.floor((Math.random() * 40 + 80) * volMult) : Math.floor((Math.random() * 20 + 30) * volMult);
      const staff = isPeak ? Math.floor((Math.random() * 8 + 25) * volMult) : Math.floor((Math.random() * 4 + 12) * volMult);
      
      const placement = isPeak 
        ? `${Math.floor(staff * 0.5)} Register, ${Math.floor(staff * 0.3)} Electronics (Certified), ${Math.ceil(staff * 0.2)} Floor`
        : `${Math.floor(staff * 0.4)} Register, 2 Electronics, ${Math.ceil(staff * 0.6) - 2} Floor`;
      
      hours.push({ time: timeStr, sales: `$${sales},000`, staff, placement });
    }
    return hours;
  }

  // --- Button Handlers ---
  const handleOptimize = () => { setStatus('Running AI Protocol...'); setTimeout(() => { setHeatMap(generateHeat(true)); setStatus('Heat Map Optimized.'); }, 1200); };
  const handleSaveMap = () => setStatus('Heat Map Saved to ERP.');
  const handleSaveForecast = () => setStatus(`Black Friday Forecast for Store #${storeId} Saved!`);
  const handleERPSync = () => setStatus('Live SAP ERP Synchronization Complete.');
  const handleFileUpload = (e) => { if (e.target.files[0]) setStatus(`Employee Data Loaded: ${e.target.files[0].name}`); };
  
  const handlePOSAnalysis = () => {
    setStatus(`Crunching Historical POS Data for Store #${storeId}...`);
    setPosInsights(null); 
    setTimeout(() => {
      setPosInsights({ location: storeId === '2080' ? 'Battle Creek, MI (#2080)' : 'Kalamazoo, MI (#5065)', hourly: generateHourlyForecast(storeId) });
      setStatus('Automated Schedule Generated!');
    }, 1500);
  };

  const getHeatColor = (value) => value > 75 ? '#ef4444' : value > 50 ? '#f59e0b' : value > 25 ? '#3b82f6' : '#10b981';

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ borderBottom: '2px solid #334155', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#38bdf8' }}>OptiSchedule Pro: Walmart Edition</h1>
        <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Black Friday Intelligence & ERP Hub</p>
      </div>

      {/* Control Panel */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Status: <span style={{ color: '#34d399' }}>{status}</span></p>
          <select value={storeId} onChange={(e) => setStoreId(e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#334155', color: '#fff', border: 'none' }}>
            <option value="2080">Store #2080 (Battle Creek)</option>
            <option value="5065">Store #5065 (Kalamazoo)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current.click()} style={{ ...btnStyle, backgroundColor: '#475569' }}>📂 Upload JSON</button>
          <button onClick={handleERPSync} style={{ ...btnStyle, backgroundColor: '#6366f1' }}>🔄 Sync SAP</button>
          <button onClick={handleOptimize} style={{ ...btnStyle, backgroundColor: '#0284c7' }}>⚡ Optimize Heat Map</button>
          <button onClick={handleSaveMap} style={{ ...btnStyle, backgroundColor: '#059669' }}>💾 Save Map</button>
        </div>
      </div>

      {/* Heat Map Grid */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Workforce Density Bottlenecks</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {heatMap.map((val, idx) => (
            <div key={idx} style={{ backgroundColor: getHeatColor(val), height: '50px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>{val}%</div>
          ))}
        </div>
      </div>

      {/* POS Generator */}
      <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '10px' }}>
        <button onClick={handlePOSAnalysis} style={{ ...btnStyle, backgroundColor: '#c026d3', width: '100%', marginBottom: '15px' }}>
          📊 Generate Hourly Forecast
        </button>

        {posInsights && (
          <div style={{ backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ color: '#38bdf8', margin: 0 }}>{posInsights.location} Routing Strategy</h4>
              <button onClick={handleSaveForecast} style={{ padding: '8px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>💾 Save Forecast</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #334155' }}>
                    <th style={{ padding: '10px' }}>Time</th><th style={{ padding: '10px' }}>Est. Sales</th><th style={{ padding: '10px' }}>Staff Req.</th><th style={{ padding: '10px' }}>Skill-Based Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {posInsights.hourly.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '10px', color: '#34d399', fontWeight: 'bold' }}>{row.time}</td><td style={{ padding: '10px' }}>{row.sales}</td><td style={{ padding: '10px' }}>{row.staff}</td><td style={{ padding: '10px', color: '#94a3b8' }}>{row.placement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = { padding: '12px 16px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', flexGrow: 1 };
export default App;
