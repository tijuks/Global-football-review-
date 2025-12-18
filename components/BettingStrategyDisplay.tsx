

import React from 'react';
import { BettingInfo } from '../types';

interface BettingStrategyDisplayProps {
  content: BettingInfo | null;
  leagueName: string;
}

const BettingStrategyDisplay: React.FC<BettingStrategyDisplayProps> = ({ content, leagueName }) => {
  if (!content) {
    return <p className="text-gray-400 italic mt-4">No betting analysis available for {leagueName}.</p>;
  }

  const { strategicAdvice, odds } = content;

  // Split advice into paragraphs for better formatting
  const adviceParagraphs = strategicAdvice.split(/\n\n|\n/).map(p => p.trim()).filter(Boolean);

  return (
    <article className="bg-gray-800/60 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-6">
        Betting Analysis - {leagueName}
      </h3>
      
      <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed space-y-4 mb-10">
        <h4 className="text-xl sm:text-2xl font-semibold text-amber-300 !mb-3">Strategic Insights</h4>
        {adviceParagraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      
      {odds && odds.length > 0 ? (
        <div>
            <h4 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-4">Illustrative Match Odds</h4>
            <div className="overflow-x-auto bg-gray-900/50 rounded-lg shadow-md border border-gray-700">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Match</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">1 (Home)</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">X (Draw)</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">2 (Away)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {odds.map((match, index) => (
                            <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                                <td className="px-4 py-4 text-sm text-gray-200 font-medium">{match.homeTeam} <span className="text-gray-500 mx-1">vs</span> {match.awayTeam}</td>
                                <td className="px-4 py-4 text-sm text-gray-400 whitespace-nowrap">{match.matchDate || 'N/A'}</td>
                                <td className="px-4 py-4 text-sm text-gray-200 text-center font-mono">{match.odds['1']}</td>
                                <td className="px-4 py-4 text-sm text-gray-200 text-center font-mono">{match.odds['X']}</td>
                                <td className="px-4 py-4 text-sm text-gray-200 text-center font-mono">{match.odds['2']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-3 italic text-center">
                Note: Odds are illustrative, AI-generated estimates for informational purposes only and are not real-time betting lines.
            </p>
        </div>
      ) : (
         <p className="text-center text-gray-400 py-4">No specific match odds could be generated at this time.</p>
      )}
    </article>
  );
};

export default BettingStrategyDisplay;