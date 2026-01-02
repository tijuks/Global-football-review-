
import React from 'react';
import { TacticalData } from '../types';

interface TacticsDisplayProps {
  tacticalData: TacticalData | null;
  leagueName: string;
}

const TacticsDisplay: React.FC<TacticsDisplayProps> = ({ tacticalData, leagueName }) => {
  if (!tacticalData) {
    return <p className="text-gray-400 italic">No tactical information available for {leagueName}.</p>;
  }

  const { formationName, description } = tacticalData;

  return (
    <article className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-2">
        Tactical Analysis - {leagueName}
      </h3>
      <h4 className="text-xl font-semibold text-gray-200 mb-6">{formationName}</h4>

      <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
          <h5 className="text-lg font-semibold text-gray-100 mb-2">Formation Overview</h5>
          <p>{description}</p>
      </div>
    </article>
  );
};

export default TacticsDisplay;
