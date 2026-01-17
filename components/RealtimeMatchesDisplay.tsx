
import React, { useState } from 'react';
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

const ITEMS_PER_PAGE = 6;

const RealtimeMatchesDisplay: React.FC<RealtimeMatchesDisplayProps> = ({ matches, sources, title, onAnalyzeMatch }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMatches = matches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <article className="space-y-6 animate-fade-in">
      <div className="bg-gray-800/60 rounded-xl shadow-2xl backdrop-blur-sm overflow-hidden border border-white/5">
        <div className="p-6 sm:p-8 border-b border-gray-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="bg-gray-700/50 px-2 py-1 rounded border border-white/5">
              {matches.length} {t('match_center')}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('match.competition')}</th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('match.match')}</th>
                <th scope="col" className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('match.score_time')}</th>
                <th scope="col" className="px-6 py-4 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('match.status')}</th>
                <th scope="col" className="relative px-6 py-4"><span className="sr-only">{t('analyze')}</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {paginatedMatches.map((match, index) => (
                <tr key={startIndex + index} className="hover:bg-emerald-500/5 transition-colors group">
                  <td className="px-6 py-5 text-sm text-gray-400 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-300">{match.competition}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-200">
                      <div className="font-bold">{match.homeTeam}</div>
                      <div className="text-gray-500 text-xs">vs {match.awayTeam}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-center font-mono whitespace-nowrap">
                      <div className="bg-black/40 px-3 py-1 rounded-lg inline-block border border-white/5 text-emerald-400">
                        {match.status === 'Live' || match.status === 'HT' || match.status === 'FT' ? match.score : match.time}
                      </div>
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        {getStatusBadge(match.status, t)}
                        {(match.status === 'Live' && match.time) && (
                          <span className="text-[10px] text-red-500 font-bold animate-pulse">{match.time}'</span>
                        )}
                      </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
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
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      {t('analyze')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing <span className="text-gray-300 font-bold">{startIndex + 1}</span> to <span className="text-gray-300 font-bold">{Math.min(startIndex + ITEMS_PER_PAGE, matches.length)}</span> of <span className="text-gray-300 font-bold">{matches.length}</span> results
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-all ${currentPage === 1 ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-gray-700 text-gray-300 hover:bg-gray-800 active:scale-90'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === idx + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-all ${currentPage === totalPages ? 'border-gray-800 text-gray-700 cursor-not-allowed' : 'border-gray-700 text-gray-300 hover:bg-gray-800 active:scale-90'}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {sources && sources.length > 0 && (
        <div className="bg-gray-900/40 p-5 rounded-xl border border-white/5 animate-fade-in delay-150">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('match.verified_sources')}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source, idx) => (
              <a 
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-emerald-600/10 text-xs text-gray-400 hover:text-emerald-400 rounded-lg border border-white/5 transition-all"
              >
                <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                <span className="max-w-[180px] truncate">{source.title}</span>
                <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default RealtimeMatchesDisplay;
