import React from 'react';
import TeamRow from './TeamRow';

export default function WorldCupTable({ teams, showGroupGames, showKnockoutGames, sortBy }) {
  // Sort teams
  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'group') {
      if (a.group !== b.group) return a.group.localeCompare(b.group);
      return Number(b.stats.pts) - Number(a.stats.pts) || Number(b.stats.gd) - Number(a.stats.gd);
    } else if (sortBy === 'points') {
      return Number(b.stats.pts) - Number(a.stats.pts) || Number(b.stats.gd) - Number(a.stats.gd);
    } else if (sortBy === 'wins') {
      return Number(b.stats.w) - Number(a.stats.w);
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
            <th className="col-num">GP</th>
            <th className="col-num">W / D / L</th>
            <th className="col-num">GF / GA (GD)</th>
            <th className="col-num">Pts</th>
            {matchHeaders.map((header, i) => (
              <th key={i} style={{ textAlign: 'center' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map(team => (
            <TeamRow 
              key={team.id} 
              team={team} 
              showGroupGames={showGroupGames} 
              showKnockoutGames={showKnockoutGames} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
