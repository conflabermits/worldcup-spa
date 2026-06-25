import React from 'react';

export default function MatchCell({ game }) {
  if (!game) {
    return <td className="game-cell"><div className="game-info">TBD</div></td>;
  }

  const { opponent, date, status, statusDetail, score, opponentScore, venue } = game;
  const gameTime = new Date(date);

  const isPlayed = status === 'post';
  const isLive = status === 'in';

  let timeDisplay = '';
  if (isPlayed) {
    timeDisplay = statusDetail || 'FT';
  } else if (isLive) {
    timeDisplay = statusDetail || 'Live';
  } else {
    // Upcoming
    timeDisplay = gameTime.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
                  gameTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <td className="game-cell">
      <div className="game-info" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div className="game-opponent" title={opponent.name}>
            {opponent.logo && <img src={opponent.logo} alt={opponent.abbreviation} className="game-opponent-logo" />}
            <span>
              <a href={`https://www.espn.com/soccer/team/_/id/${opponent.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                {opponent.abbreviation}
              </a>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a href={`https://www.espn.com/soccer/match/_/gameId/${game.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isPlayed && (
                <span className="game-result">{score} - {opponentScore}</span>
              )}
              <span className="game-status" style={{ color: isLive ? 'var(--error-color)' : 'var(--text-secondary)' }}>
                {timeDisplay}
              </span>
            </a>
          </div>
        </div>
        <div className="game-status" style={{ fontSize: '0.75rem' }}>
          {venue}
        </div>
      </div>
    </td>
  );
}
