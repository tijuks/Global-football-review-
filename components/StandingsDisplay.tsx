
import React, { useState } from 'react';
import { LeagueStandings, StandingEntry } from '../types';
import { TeamLogo } from './TeamLogo';

interface StandingsDisplayProps {
  standings: LeagueStandings | null;
  leagueName: string;
}

const StandingsDisplay: React.FC<StandingsDisplayProps> = ({ standings, leagueName }) => {
  if (!standings) {
    return <p className="text-gray-400 italic mt-4">No standings information available for {leagueName}.</p>;
  }

  const renderForm = (form?: string) => {
    if (!form) return null;
    return (
      <div className="flex gap-1">
        {form.split('').map((char, i) => {
          if (char === 'W') return <div key={i} className="w-4 h-4 rounded-sm bg-pitch-green flex items-center justify-center text-[10px] font-black text-white">W</div>;
          if (char === 'L') return <div key={i} className="w-4 h-4 rounded-sm bg-rose-500 flex items-center justify-center text-[10px] font-black text-white">L</div>;
          if (char === 'D') return <div key={i} className="w-4 h-4 rounded-sm bg-gray-500 flex items-center justify-center text-[10px] font-black text-white">D</div>;
          return null;
        })}
      </div>
    );
  };

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const sortedStandings = React.useMemo(() => {
    if (!standings) return [];
    let sortableItems = [...standings.standings];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        if (sortConfig.key === 'goalsDifference') {
          aVal = a.goalsFor - a.goalsAgainst;
          bVal = b.goalsFor - b.goalsAgainst;
        } else {
          aVal = a[sortConfig.key as keyof StandingEntry];
          bVal = b[sortConfig.key as keyof StandingEntry];
        }
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' 
            ? aVal - bVal 
            : bVal - aVal;
        }

        return 0;
      });
    }
    return sortableItems;
  }, [standings?.standings, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
          {leagueName} Standings
        </h2>
      </div>

      <div className="bg-gray-800/40 rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <th className="px-4 py-4 text-center cursor-pointer" onClick={() => requestSort('rank')}># {getSortIcon('rank')}</th>
                <th className="px-4 py-4 cursor-pointer" onClick={() => requestSort('team')}>Team {getSortIcon('team')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('played')}>P {getSortIcon('played')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('wins')}>W {getSortIcon('wins')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('draws')}>D {getSortIcon('draws')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('losses')}>L {getSortIcon('losses')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('goalsFor')}>GF {getSortIcon('goalsFor')}</th>
                <th className="px-2 py-4 text-center cursor-pointer" onClick={() => requestSort('goalsAgainst')}>GA {getSortIcon('goalsAgainst')}</th>
                <th className="px-2 py-4 text-center cursor-pointer hidden sm:table-cell" onClick={() => requestSort('goalsDifference')}>GD {getSortIcon('goalsDifference')}</th>
                <th className="px-4 py-4 text-center font-black text-white cursor-pointer" onClick={() => requestSort('points')}>Pts {getSortIcon('points')}</th>
                <th className="px-4 py-4 hidden md:table-cell">Form</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedStandings.map((entry: StandingEntry) => (
                <tr key={entry.rank} className="hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-black ${entry.rank <= 4 ? 'text-blue-400' : entry.rank >= 18 ? 'text-rose-500' : 'text-gray-500'}`}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <TeamLogo teamName={entry.team} className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-bold text-white truncate max-w-[120px] sm:max-w-none">{entry.team}</span>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.played}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.wins}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.draws}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.losses}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.goalsFor}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400">{entry.goalsAgainst}</td>
                  <td className="px-2 py-4 text-center text-xs text-gray-400 hidden sm:table-cell">
                    {entry.goalsFor - entry.goalsAgainst > 0 ? `+${entry.goalsFor - entry.goalsAgainst}` : entry.goalsFor - entry.goalsAgainst}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-black text-pitch-green-light">{entry.points}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    {renderForm(entry.form)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-tighter text-gray-500 px-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-blue-400" /> Champions League
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-rose-500" /> Relegation
        </div>
      </div>

      {/* Team Form Guide Section */}
      <section className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📈</span>
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Team Form Guide</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {standings.standings.slice(0, 8).map((entry: StandingEntry) => (
            <div key={`form-${entry.team}`} className="bg-chocolate/60 border border-white/5 rounded-2xl p-4 flex flex-col gap-3 hover:border-pitch-green/20 transition-all">
              <div className="flex items-center gap-3">
                <TeamLogo teamName={entry.team} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white truncate">{entry.team}</span>
                  <span className="text-[10px] text-gray-500">Rank #{entry.rank}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Recent Form</span>
                {renderForm(entry.form)}
              </div>
              <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1">
                <span className="text-[10px] text-gray-500">Points: <span className="text-pitch-green-light font-bold">{entry.points}</span></span>
                <span className="text-[10px] text-gray-500">GD: <span className={entry.goalsFor - entry.goalsAgainst >= 0 ? 'text-pitch-green-light' : 'text-rose-400'}>{entry.goalsFor - entry.goalsAgainst}</span></span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-gray-600 italic mt-4 px-2">
          Showing form guide for the top 8 teams in the league.
        </p>
      </section>
    </div>
  );
};

export default StandingsDisplay;
