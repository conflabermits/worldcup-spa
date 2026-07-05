import React, { useEffect, useState } from 'react';
import { fetchWorldCupData } from './api/espn';
import WorldCupTable from './components/WorldCupTable';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState('next_game');
  const [showGroupGames, setShowGroupGames] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showKnockoutGames, setShowKnockoutGames] = useState(true);
  const [showEliminated, setShowEliminated] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const result = await fetchWorldCupData(forceRefresh);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Failed to load World Cup data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const isStale = data && (new Date().getTime() > data.expiresAt);

  if (loading && !data) {
    return <div className="loading-state">Loading World Cup Data...</div>;
  }

  if (error && !data) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div>
      <header style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ color: 'var(--accent-color)', margin: 0 }}>World Cup 2026 Consolidator</h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>A clean, consolidated view of group standings and match schedules.</p>
      </header>

      {data && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: '8px', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ marginRight: '0.5rem', fontWeight: 600 }}>Sort Teams By:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="group">Group Default</option>
                <option value="points">Total Points</option>
                <option value="wins">Total Wins</option>
                <option value="goal_difference">Goal Difference</option>
                <option value="next_game">Next Game (Soonest)</option>
              </select>
            </div>
            <div>
              <label style={{ marginRight: '0.5rem', fontWeight: 600 }}>Show:</label>
              <label style={{ marginRight: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={showGroupGames} onChange={e => setShowGroupGames(e.target.checked)} style={{ marginRight: '0.2rem' }} />
                Group Stage Games
              </label>
              <label style={{ marginRight: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={showGroupInfo} onChange={e => setShowGroupInfo(e.target.checked)} style={{ marginRight: '0.2rem' }} />
                Group Stage Info
              </label>
              <label style={{ marginRight: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={showKnockoutGames} onChange={e => setShowKnockoutGames(e.target.checked)} style={{ marginRight: '0.2rem' }} />
                Knockout Stage
              </label>
              <label style={{ cursor: 'pointer' }}>
                <input type="checkbox" checked={showEliminated} onChange={e => setShowEliminated(e.target.checked)} style={{ marginRight: '0.2rem' }} />
                Eliminated Teams
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {!isStale && <span style={{ color: 'var(--error-color)', fontSize: '0.85rem', maxWidth: '300px', textAlign: 'right' }}>⚠ Cache is still warm. Refreshing now will hit the API and may cause rate-limiting.</span>}
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Cached at: {new Date(data.lastUpdated).toLocaleTimeString()}
            </span>
            <button 
              onClick={handleRefresh}
              style={{
                backgroundColor: isStale ? 'var(--success-color)' : 'transparent',
                color: isStale ? 'white' : 'var(--error-color)',
                border: isStale ? 'none' : '1px solid var(--error-color)',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Refresh Data
            </button>
          </div>
        </div>
      )}

      {data && data.teams && (
        <WorldCupTable 
          teams={data.teams.filter(t => showEliminated || !t.isEliminated)} 
          showGroupGames={showGroupGames} 
          showGroupInfo={showGroupInfo}
          showKnockoutGames={showKnockoutGames} 
          sortBy={sortBy} 
        />
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', padding: '1.5rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        View source code for this page at <a href="https://github.com/conflabermits/worldcup-spa" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>https://github.com/conflabermits/worldcup-spa</a>
      </footer>
    </div>
  );
}

export default App;
