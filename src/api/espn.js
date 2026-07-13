const STANDINGS_URL = 'https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings';
const SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=2026&limit=300';

const CACHE_KEY = 'wc_data_cache';

export async function fetchWorldCupData(forceRefresh = false) {
  const now = new Date().getTime();
  
  // 1. Check Cache
  const cachedStr = localStorage.getItem(CACHE_KEY);
  if (cachedStr && !forceRefresh) {
    try {
      const cached = JSON.parse(cachedStr);
      if (now < cached.expiresAt) {
        return { teams: cached.data.teams, lastUpdated: cached.cachedAt, expiresAt: cached.expiresAt };
      }
    } catch (e) {
      console.warn("Invalid cache data, fetching fresh.");
    }
  }

  // 2. Fetch fresh data
  try {
    const [standingsRes, scoreboardRes] = await Promise.all([
      fetch(STANDINGS_URL),
      fetch(SCOREBOARD_URL)
    ]);

    if (!standingsRes.ok || !scoreboardRes.ok) {
      throw new Error("Failed to fetch from ESPN APIs");
    }

    const standingsData = await standingsRes.json();
    const scoreboardData = await scoreboardRes.json();

    // 3. Process Data
    const data = processData(standingsData, scoreboardData);

    // 4. Determine Cache TTL based on active games
    const hasActiveGames = data.teams.some(t => 
      t.games.some(g => {
        if (!g.date) return false;
        const gameTime = new Date(g.date).getTime();
        // Active window: 30 mins before to 150 mins after start
        return (now >= gameTime - 30 * 60 * 1000) && (now <= gameTime + 150 * 60 * 1000);
      })
    );

    const ttlMinutes = hasActiveGames ? 5 : 60;
    const expiresAt = now + (ttlMinutes * 60 * 1000);

    // 5. Save to Cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      expiresAt,
      cachedAt: now
    }));

    return { teams: data.teams, lastUpdated: now, expiresAt };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

function processData(standingsData, scoreboardData) {
  const teamsMap = new Map();

  // Parse Standings (Groups -> Teams)
  const groups = standingsData.children || [];
  groups.forEach(group => {
    const groupName = group.name;
    const entries = (group.standings && group.standings.entries) || [];
    entries.forEach(entry => {
      const t = entry.team;
      const statsArray = entry.stats || [];
      const getStat = (name) => {
        const s = statsArray.find(st => st.name === name);
        return s ? s.displayValue : '0';
      };

      teamsMap.set(t.id, {
        id: t.id,
        name: t.displayName,
        abbreviation: t.abbreviation,
        logo: t.logos && t.logos.length > 0 ? t.logos[0].href : null,
        group: groupName,
        stats: {
          gp: getStat('gamesPlayed'),
          w: getStat('wins'),
          d: getStat('ties'),
          l: getStat('losses'),
          gf: getStat('pointsFor'),
          ga: getStat('pointsAgainst'),
          gd: getStat('pointDifferential'),
          pts: getStat('points'),
          advanced: getStat('advanced')
        },
        games: [] // Will be populated from scoreboard
      });
    });
  });

  // Parse Scoreboard (Events -> Games)
  const events = scoreboardData.events || [];
  events.forEach(event => {
    const comp = event.competitions && event.competitions[0];
    if (!comp) return;

    const competitors = comp.competitors || [];
    if (competitors.length < 2) return;

    const team1 = competitors[0];
    const team2 = competitors[1];

    let venueStr = 'TBD';
    if (comp.venue && comp.venue.address) {
      const city = comp.venue.address.city || '';
      let country = comp.venue.address.country || '';
      if (country.includes('USA')) country = '🇺🇸';
      else if (country.includes('Mexico')) country = '🇲🇽';
      else if (country.includes('Canada')) country = '🇨🇦';
      venueStr = city ? `${city} ${country}` : (country || comp.venue.fullName);
    } else if (comp.venue) {
      venueStr = comp.venue.fullName;
    }

    const status = event.status ? event.status.type.state : 'pre';
    const detail = event.status ? event.status.type.shortDetail : '';
    const date = event.date;

    const isKnockout = event.season && event.season.slug !== 'group-stage';

    const addGameToTeam = (teamInfo, opponentInfo) => {
      if (teamsMap.has(teamInfo.team.id)) {
        const t = teamsMap.get(teamInfo.team.id);
        const oppLogo = opponentInfo.team.logos && opponentInfo.team.logos.length > 0 ? opponentInfo.team.logos[0].href : null;
        
        t.games.push({
          id: event.id,
          date: date,
          status: status,
          statusDetail: detail,
          venue: venueStr,
          opponent: {
            id: opponentInfo.team.id,
            name: opponentInfo.team.displayName,
            abbreviation: opponentInfo.team.abbreviation,
            logo: oppLogo
          },
          score: teamInfo.score,
          opponentScore: opponentInfo.score,
          winner: teamInfo.winner,
          isKnockout: isKnockout
        });
      }
    };

    addGameToTeam(team1, team2);
    addGameToTeam(team2, team1);
  });

  // Sort games and compute elimination
  teamsMap.forEach(team => {
    team.games.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const lostKoMatch = team.games.some(g => g.isKnockout && g.status === 'post' && g.winner === false);
    const groupMatchesPlayed = team.games.filter(g => !g.isKnockout && g.status === 'post').length;
    const groupEliminated = groupMatchesPlayed >= 3 && team.stats.advanced === '0';
    
    team.isEliminated = lostKoMatch || groupEliminated;
  });

  return {
    teams: Array.from(teamsMap.values()),
    lastUpdated: new Date().toISOString()
  };
}
