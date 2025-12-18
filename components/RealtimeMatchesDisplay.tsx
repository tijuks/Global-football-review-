
import React from 'react';
import { RealtimeMatch, MatchInfo } from '../types';

interface RealtimeMatchesDisplayProps {
  matches: RealtimeMatch[] | null;
  title: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

const getStatusBadge = (status: RealtimeMatch['status']) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold leading-tight rounded-full";
  switch (status) {
    case 'Live':
      return <span className={`${baseClasses} text-red-100 bg-red-600 animate-pulse`}>LIVE</span>;
    case 'HT':
      return <span className={`${baseClasses} text-yellow-900 bg-yellow-400`}>HT</span>;
    case 'FT':
      return <span className={`${baseClasses} text-gray-100 bg-gray-600`}>FT</span>;
    case 'Scheduled':
      return <span className={`${baseClasses} text-blue-800 bg-blue-300`}>UPCOMING</span>;
    case 'Postponed':
       return <span className={`${baseClasses} text-orange-800 bg-orange-300`}>PST</span>;
    case 'Cancelled':
       return <span className={`${baseClasses} text-red-800 bg-red-300`}>CANC</span>;
    default:
      return <span className={`${baseClasses} text-gray-800 bg-gray-300`}>{status}</span>;
  }
};


const RealtimeMatchesDisplay: React.FC<RealtimeMatchesDisplayProps> = ({ matches, title, onAnalyzeMatch }) => {

  if (!matches) {
    return <p className="text-gray-400 italic mt-4">No match information available for {title}.</p>;
  }

  if (matches.length === 0) {
    return (
        <div className="text-center bg-gray-800/50 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Matches Found</h3>
            <p className="text-gray-400">There are no {title.toLowerCase()} to display at this time.</p>
        </div>
    );
  }

  return (
    <article className="bg-gray-800/60 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        {title}
      </h3>
      <div className="overflow-x-auto bg-gray-900/50 rounded-lg shadow-md border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Competition</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Match</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Score / Time</th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-3 py-3"><span className="sr-only">Analyze</span></th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {matches.map((match, index) => (
              <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 py-4 text-sm text-gray-400 whitespace-nowrap">{match.competition}</td>
                <td className="px-3 py-4 text-sm text-gray-200 font-medium">
                    <div>{match.homeTeam}</div>
                    <div className="text-gray-400">vs {match.awayTeam}</div>
                </td>
                <td className="px-3 py-4 text-sm text-center text-gray-200 font-mono whitespace-nowrap">
                    {match.status === 'Live' || match.status === 'HT' || match.status === 'FT' ? match.score : match.time}
                </td>
                <td className="px-3 py-4 text-center whitespace-nowrap">
                    {getStatusBadge(match.status)}
                    {(match.status === 'Live' && match.time) && <div className="text-xs text-red-400 animate-pulse mt-1">{match.time}</div>}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onAnalyzeMatch({
                      homeTeam: match.homeTeam,
                      awayTeam: match.awayTeam,
                      score: match.score,
                      context: match.competition,
                      isFuture: match.status === 'Scheduled',
                      entityName: title,
                      date: match.status === 'Scheduled' ? match.time : undefined,
                    })}
                    className="text-green-400 hover:text-green-300 font-semibold disabled:text-gray-500 disabled:cursor-not-allowed"
                    aria-label={`Analyze match between ${match.homeTeam} and ${match.awayTeam}`}
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default RealtimeMatchesDisplay;
