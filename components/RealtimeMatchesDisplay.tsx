
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RealtimeMatch, MatchInfo, GroundingSource } from '../types';

interface RealtimeMatchesDisplayProps {
  matches: RealtimeMatch[] | null;
  sources?: GroundingSource[];
  title: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

const getStatusBadge = (status: RealtimeMatch['status'], t: any) => {
  const baseClasses = "px-2.5 py-1 text-xs font-semibold leading-tight rounded-full";
  switch (status) {
    case 'Live':
      return <span className={`${baseClasses} text-red-100 bg-red-600 animate-pulse`}>{t('live')}</span>;
    case 'HT':
      return <span className={`${baseClasses} text-yellow-900 bg-yellow-400`}>HT</span>;
    case 'FT':
      return <span className={`${baseClasses} text-gray-100 bg-gray-600`}>FT</span>;
    case 'Scheduled':
      return <span className={`${baseClasses} text-blue-800 bg-blue-300`}>{t('upcoming')}</span>;
    case 'Postponed':
       return <span className={`${baseClasses} text-orange-800 bg-orange-300`}>PST</span>;
    case 'Cancelled':
       return <span className={`${baseClasses} text-red-800 bg-red-300`}>CANC</span>;
    default:
      return <span className={`${baseClasses} text-gray-800 bg-gray-300`}>{status}</span>;
  }
};


const RealtimeMatchesDisplay: React.FC<RealtimeMatchesDisplayProps> = ({ matches, sources, title, onAnalyzeMatch }) => {
  const { t } = useTranslation();

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
    <article className="space-y-6">
      <div className="bg-gray-800/60 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
        <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
          {title}
        </h3>
        <div className="overflow-x-auto bg-gray-900/50 rounded-lg shadow-md border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('match.competition')}</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('match.match')}</th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">{t('match.score_time')}</th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">{t('match.status')}</th>
                <th scope="col" className="relative px-3 py-3"><span className="sr-only">{t('analyze')}</span></th>
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
                      {getStatusBadge(match.status, t)}
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
                      {t('analyze')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sources && sources.length > 0 && (
        <div className="bg-gray-900/40 p-4 rounded-xl border border-white/5">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">{t('match.verified_sources')}</h4>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 hover:text-white rounded-lg border border-white/5 transition-colors"
              >
                <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default RealtimeMatchesDisplay;
