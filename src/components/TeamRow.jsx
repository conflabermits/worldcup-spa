import React from 'react';
import MatchCell from './MatchCell';

export default function TeamRow({ team, showGroupGames, showKnockoutGames }) {
  // Sort games based on user selection
  const getOrderedGames = () => {
    let gamesList = [];
    const groupGames = team.games.filter(g => !g.isKnockout);
    const koGames = team.games.filter(g => g.isKnockout);

    if (showGroupGames) {
      // Pad to 3 group games
      for (let i = 0; i < 3; i++) {
        gamesList.push(groupGames[i] || null);
      }
    }

    if (showKnockoutGames) {
      // Pad to 5 KO games
      for (let i = 0; i < 5; i++) {
        gamesList.push(koGames[i] || null);
      }
    }
    
    return gamesList;
  };

  const orderedGames = getOrderedGames();

  return (
    <tr>
      <td className="col-team">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {team.logo && <img src={team.logo} alt={team.abbreviation} className="team-logo" />}
          <span title={team.abbreviation}>
            <a href={`https://www.espn.com/soccer/team/_/id/${team.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              {team.name}
            </a>
          </span>
        </div>
        <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '1rem'}}>{team.group}</span>
      </td>
      <td className="col-num">{team.stats.gp}</td>
      <td className="col-num">{team.stats.w} / {team.stats.d} / {team.stats.l}</td>
      <td className="col-num">{team.stats.gf} / {team.stats.ga} ({team.stats.gd})</td>
      <td className="col-num" style={{ fontWeight: 'bold' }}>{team.stats.pts}</td>
      
      {orderedGames.map((game, i) => (
        <MatchCell key={game ? game.id : `empty-${i}`} game={game} />
      ))}
    </tr>
  );
}
