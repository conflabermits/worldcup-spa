import React from 'react';
import TeamRow from './TeamRow';

export default function WorldCupTable({ teams, showGroupGames, showGroupInfo, showKnockoutGames, sortBy }) {
  const getNextGameTime = (team) => {
    const nextGame = team.games.find(g => g.status !== 'post');
    return nextGame ? new Date(nextGame.date).getTime() : Infinity;
  };

  // Sort teams
  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'group') {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return Number(b.stats.pts) - Number(a.stats.pts) || Number(b.stats.gd) - Number(a.stats.gd);
    } else if (sortBy === 'points') {
      return Number(b.stats.pts) - Number(a.stats.pts) || Number(b.stats.gd) - Number(a.stats.gd);
    } else if (sortBy === 'wins') {
      return Number(b.stats.w) - Number(a.stats.w) || Number(b.stats.pts) - Number(a.stats.pts);
    } else if (sortBy === 'goal_difference') {
      return Number(b.stats.gd) - Number(a.stats.gd) || Number(b.stats.pts) - Number(a.stats.pts);
    } else if (sortBy === 'next_game') {
      const timeA = getNextGameTime(a);
      const timeB = getNextGameTime(b);
      if (timeA !== timeB) return timeA - timeB;
      // Fallback if games are at the same time or both have no next games
      return Number(b.stats.pts) - Number(a.stats.pts) || Number(b.stats.gd) - Number(a.stats.gd);
    }
    return 0;
  });

  const getMatchHeaders = () => {
    let headers = [];
    if (showGroupGames) {
      headers.push('Group M 1', 'Group M 2', 'Group M 3');
    }
    if (showKnockoutGames) {
      headers.push('KO M 1', 'KO M 2', 'KO M 3', 'KO M 4', 'KO M 5');
    }
    return headers;
  };

  const matchHeaders = getMatchHeaders();

  return (
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            {showGroupInfo && (
              <th className="col-num">GP</th>
            )}
            {showGroupInfo && (
              <>
                <th className="col-num">W / D / L</th>
                <th className="col-num">GF / GA (GD)</th>
              </>
            )}
            {showGroupInfo && (
              <th className="col-num">Pts</th>
            )}
            {matchHeaders.map((header, i) => (
              <th key={i} style={{ textAlign: 'center' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((team, index) => {
            let isMatchupPair = false;
            let pairIndex = -1;

            if (sortBy === 'next_game') {
              const nextGameId = getNextGameTime(team) !== Infinity 
                ? team.games.find(g => g.status !== 'post')?.id 
                : null;
              
              if (nextGameId) {
                const prevTeam = sortedTeams[index - 1];
                const nextTeam = sortedTeams[index + 1];
                
                const prevNextGameId = prevTeam && getNextGameTime(prevTeam) !== Infinity 
                  ? prevTeam.games.find(g => g.status !== 'post')?.id 
                  : null;
                  
                const nextNextGameId = nextTeam && getNextGameTime(nextTeam) !== Infinity 
                  ? nextTeam.games.find(g => g.status !== 'post')?.id 
                  : null;

                if (prevNextGameId === nextGameId) {
                  isMatchupPair = true;
                  pairIndex = 1; // Second in pair
                } else if (nextNextGameId === nextGameId) {
                  isMatchupPair = true;
                  pairIndex = 0; // First in pair
                }
              }
            }

            return (
              <TeamRow 
                key={team.id} 
                team={team} 
                showGroupGames={showGroupGames}
                showGroupInfo={showGroupInfo} 
                showKnockoutGames={showKnockoutGames} 
                isMatchupPair={isMatchupPair}
                pairIndex={pairIndex}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
