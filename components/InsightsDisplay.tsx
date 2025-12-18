

import React from 'react';
import { InsightInfo } from '../types';
import InteractiveText from './InteractiveText';

interface InsightsDisplayProps {
  content: InsightInfo | null;
  leagueName: string;
  onPlayerClick: (playerName: string) => void;
}

const InsightsDisplay: React.FC<InsightsDisplayProps> = ({ content, leagueName, onPlayerClick }) => {
  if (!content) {
    return <p className="text-gray-400 italic">No insight information available for {leagueName}.</p>;
  }

  return (
    <article className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        Deeper Insights - {leagueName}
      </h3>
      <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
        <InteractiveText text={content} onPlayerClick={onPlayerClick} />
      </div>
    </article>
  );
};

export default InsightsDisplay;