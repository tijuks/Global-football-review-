
import React from 'react';
import { PlayerStatsData } from '../types';
import { SortableStatTable } from './SortableStatTable';

interface PlayerStatsDisplayProps {
  stats: PlayerStatsData | null;
  entityName: string;
}

const PlayerStatsDisplay: React.FC<PlayerStatsDisplayProps> = ({ stats, entityName }) => {
  if (!stats) {
    return <p className="text-gray-400 italic">No statistics available for {entityName}.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">📈</span>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          {entityName} - Player Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SortableStatTable title="Top Scorers" data={stats.topScorers} icon="⚽" metric="goals" />
        <SortableStatTable title="Top Assisters" data={stats.topAssisters} icon="🎯" metric="assists" />
      </div>

      <div className="max-w-2xl">
        <SortableStatTable title="Most Appearances" data={stats.mostAppearances} icon="🏃" metric="appearances" />
      </div>
    </div>
  );
};

export default PlayerStatsDisplay;
