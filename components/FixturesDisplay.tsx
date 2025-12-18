

import React from 'react';
import { FixtureInfo, MatchInfo } from '../types';

interface FixturesDisplayProps {
  content: FixtureInfo | null;
  leagueName: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

interface ParsedFixture {
  homeTeam: string;
  awayTeam: string;
  score?: string; // For recent results
  context: string; // Date, competition, time
  isRaw?: boolean; // If true, homeTeam contains the raw line
}

const FixturesDisplay: React.FC<FixturesDisplayProps> = ({ content, leagueName, onAnalyzeMatch }) => {
  if (!content) {
    return <p className="text-gray-400 italic mt-4">No fixture information available for {leagueName}.</p>;
  }

  const lines = content.split('\\n').map(line => line.trim()).filter(line => line.length > 0);

  const recentFixtures: ParsedFixture[] = [];
  const upcomingFixtures: ParsedFixture[] = [];
  let currentSection: 'recent' | 'upcoming' | 'none' = 'none';

  const recentRegex = /^(.*?)\s+(\d+\s*-\s*\d+)\s+(.*?)(?:\s+\((.*)\))?$/;
  const upcomingRegex = /^(.*?)\s+vs\s+(.*?)(?:\s+\((.*)\))?$/;

  for (const line of lines) {
    if (line.toLowerCase().startsWith('recent:')) {
      currentSection = 'recent';
      const headerContent = line.substring('recent:'.length).trim();
      if (headerContent) { // If there's content on the same line as "Recent:"
         // This is unlikely given the prompt, but good to handle
        recentFixtures.push({ homeTeam: headerContent, awayTeam: '', context: 'General Info', isRaw: true });
      }
      continue;
    }
    if (line.toLowerCase().startsWith('upcoming:')) {
      currentSection = 'upcoming';
      const headerContent = line.substring('upcoming:'.length).trim();
      if (headerContent) {
        upcomingFixtures.push({ homeTeam: headerContent, awayTeam: '', context: 'General Info', isRaw: true });
      }
      continue;
    }

    if (currentSection === 'recent') {
      const match = line.match(recentRegex);
      if (match) {
        recentFixtures.push({
          homeTeam: match[1].trim(),
          score: match[2].trim(),
          awayTeam: match[3].trim(),
          context: match[4] ? match[4].trim() : 'N/A',
        });
      } else {
        recentFixtures.push({ homeTeam: line, awayTeam: '', context: '', isRaw: true });
      }
    } else if (currentSection === 'upcoming') {
      const match = line.match(upcomingRegex);
      if (match) {
        upcomingFixtures.push({
          homeTeam: match[1].trim(),
          awayTeam: match[2].trim(),
          context: match[3] ? match[3].trim() : 'N/A',
        });
      } else {
        upcomingFixtures.push({ homeTeam: line, awayTeam: '', context: '', isRaw: true });
      }
    } else {
        // Lines before any section header, treat as general upcoming if "vs" or recent if score like pattern
        if (line.includes(' vs ')) {
             const match = line.match(upcomingRegex);
             if (match) {
                upcomingFixtures.push({
                    homeTeam: match[1].trim(),
                    awayTeam: match[2].trim(),
                    context: match[3] ? match[3].trim() : 'N/A',
                });
            } else {
                upcomingFixtures.push({ homeTeam: line, awayTeam: '', context: '', isRaw: true });
            }
        } else if (/\d+\s*-\s*\d+/.test(line)) {
            const match = line.match(recentRegex);
            if (match) {
                recentFixtures.push({
                    homeTeam: match[1].trim(),
                    score: match[2].trim(),
                    awayTeam: match[3].trim(),
                    context: match[4] ? match[4].trim() : 'N/A',
                });
            } else {
                 recentFixtures.push({ homeTeam: line, awayTeam: '', context: '', isRaw: true });
            }
        } else {
            // Default to upcoming for miscellaneous lines or create a general info section
            upcomingFixtures.push({ homeTeam: line, awayTeam: '', context: 'General Information', isRaw: true });
        }
    }
  }

  const renderTable = (title: string, fixtures: ParsedFixture[], isFuture: boolean) => {
    if (fixtures.length === 0) return null;

    return (
      <div className="mb-8">
        <h4 className="text-xl sm:text-2xl font-semibold text-green-400 mb-4">{title}</h4>
        <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Home Team</th>
                {!isFuture && <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>}
                {isFuture && <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">vs</th>}
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Away Team</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details / Context</th>
                <th scope="col" className="relative px-4 py-3"><span className="sr-only">Analyze</span></th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {fixtures.map((fixture, index) => (
                <tr key={index} className={fixture.isRaw ? "bg-gray-700/50" : "hover:bg-gray-700/50"}>
                  {fixture.isRaw ? (
                    <td colSpan={5} className="px-4 py-3 text-sm text-gray-300 whitespace-normal">
                      {fixture.homeTeam}
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-200 font-medium whitespace-nowrap">{fixture.homeTeam}</td>
                      {!isFuture && <td className="px-4 py-3 text-sm text-gray-200 text-center whitespace-nowrap">{fixture.score}</td>}
                      {isFuture && <td className="px-4 py-3 text-sm text-gray-400 text-center whitespace-nowrap">vs</td>}
                      <td className="px-4 py-3 text-sm text-gray-200 font-medium whitespace-nowrap">{fixture.awayTeam}</td>
                      <td className="px-4 py-3 text-sm text-gray-400 whitespace-normal">{fixture.context}</td>
                       <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onAnalyzeMatch({
                                homeTeam: fixture.homeTeam,
                                awayTeam: fixture.awayTeam,
                                score: fixture.score,
                                context: fixture.context,
                                isFuture,
                                entityName: leagueName
                            })}
                            className="text-green-400 hover:text-green-300 font-semibold disabled:text-gray-500 disabled:cursor-not-allowed"
                            aria-label={`Analyze match between ${fixture.homeTeam} and ${fixture.awayTeam}`}
                          >
                            Analyze
                          </button>
                        </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <article className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        Fixtures & Results - {leagueName}
      </h3>
      {renderTable('Recent Results', recentFixtures, false)}
      {renderTable('Upcoming Fixtures', upcomingFixtures, true)}
      {recentFixtures.length === 0 && upcomingFixtures.length === 0 && (
         <p className="text-gray-400 italic mt-4">Could not parse specific fixtures. Raw data might be available but not in a recognized format.</p>
      )}
    </article>
  );
};

export default FixturesDisplay;