import React from 'react';
import MatchCell from './MatchCell';
import { getTeamColor } from '../api/teamColors';

export default function TeamRow({ team, showGroupGames, showGroupInfo, showKnockoutGames, isMatchupPair, pairIndex }) {
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
  const teamColor = getTeamColor(team.abbreviation);

  // Matchup block styling
  let rowClass = 'team-row';
  if (isMatchupPair) {
    rowClass += ' matchup-pair';
    rowClass += pairIndex === 0 ? ' matchup-first' : ' matchup-second';
  }

  return (
    <tr 
      className={rowClass}
      style={{
        background: `linear-gradient(90deg, ${teamColor}26 0%, transparent 50%)`
      }}
    >
      <td className="col-team">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {team.logo && <img src={team.logo} alt={team.abbreviation} className="team-logo" />}
          <span title={team.abbreviation}>
            <a href={`https://www.espn.com/soccer/team/_/id/${team.id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              {team.name}
            </a>
          </span>
        </div>
        {showGroupInfo && (
          <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem', marginLeft: '1rem'}}>{team.group}</span>
        )}
      </td>
      {showGroupInfo && (
        <td className="col-num">{team.stats.gp}</td>
      )}
      {showGroupInfo && (
        <>
          <td className="col-num">{team.stats.w} / {team.stats.d} / {team.stats.l}</td>
          <td className="col-num">{team.stats.gf} / {team.stats.ga} ({team.stats.gd})</td>
        </>
      )}
      {showGroupInfo && (
        <td className="col-num" style={{ fontWeight: 'bold' }}>{team.stats.pts}</td>
      )}
      
      {orderedGames.map((game, i) => (
        <MatchCell key={game ? game.id : `empty-${i}`} game={game} />
      ))}
    </tr>
  );
}
