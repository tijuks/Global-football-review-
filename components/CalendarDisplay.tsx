

import React, { useMemo } from 'react';
import { Fixture, MatchInfo } from '../types';

interface CalendarDisplayProps {
  fixtures: Fixture[] | null;
  entityName: string;
  onAnalyzeMatch: (match: MatchInfo) => void;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({ fixtures, entityName, onAnalyzeMatch }) => {
  const groupedFixtures = useMemo(() => {
    if (!fixtures) return {};
    return fixtures.reduce((acc, fixture) => {
      const date = fixture.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(fixture);
      return acc;
    }, {} as Record<string, Fixture[]>);
  }, [fixtures]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedFixtures).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [groupedFixtures]);

  if (!fixtures) {
    return <p className="text-gray-400 italic mt-4">No calendar information available for {entityName}.</p>;
  }

  if (fixtures.length === 0) {
    return (
        <div className="text-center bg-gray-800/50 p-8 rounded-xl">
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Upcoming Fixtures</h3>
            <p className="text-gray-400">There are no scheduled matches for {entityName} in the near future.</p>
        </div>
    );
  }

  return (
    <article className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        Upcoming Calendar - {entityName}
      </h3>
      <div className="space-y-8">
        {sortedDates.map(date => (
          <div key={date} className="relative">
            <div className="absolute left-0 h-full w-0.5 bg-gray-700 ml-5"></div>
            <div className="flex items-center mb-4">
              <div className="z-10 bg-green-500 text-white rounded-full h-10 w-10 flex items-center justify-center font-bold">
                 {new Date(date + 'T00:00:00').getDate()}
              </div>
              <h4 className="ml-4 text-xl font-semibold text-gray-200">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
            </div>
            <div className="ml-5 pl-8 space-y-4 border-l-2 border-transparent">
                {groupedFixtures[date].map((fixture, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                        <p className="font-semibold text-sm text-green-400 mb-2">{fixture.competition}</p>
                        <div className="flex items-center justify-between space-x-2">
                           <p className="text-lg font-bold text-gray-100 flex-1 text-right">{fixture.homeTeam}</p>
                           <p className="text-gray-400 font-bold text-sm">vs</p>
                           <p className="text-lg font-bold text-gray-100 flex-1 text-left">{fixture.awayTeam}</p>
                        </div>
                        {fixture.time && <p className="text-center text-sm text-gray-400 mt-2">{fixture.time}</p>}
                         <div className="text-center mt-3">
                            <button
                                onClick={() => onAnalyzeMatch({
                                    homeTeam: fixture.homeTeam,
                                    awayTeam: fixture.awayTeam,
                                    context: fixture.competition,
                                    date: fixture.date,
                                    isFuture: true,
                                    entityName: entityName
                                })}
                                className="text-green-400 hover:text-green-200 text-sm font-semibold px-3 py-1 rounded-md bg-gray-700/80 hover:bg-gray-600/80 transition-colors"
                                aria-label={`Analyze match between ${fixture.homeTeam} and ${fixture.awayTeam}`}
                            >
                                Analyze Match
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default CalendarDisplay;