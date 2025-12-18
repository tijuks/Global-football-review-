
import React from 'react';
import { PerformanceDataInfo } from '../types';

interface PerformanceDataDisplayProps {
  content: PerformanceDataInfo | null;
  leagueName: string;
}

const PerformanceDataDisplay: React.FC<PerformanceDataDisplayProps> = ({ content, leagueName }) => {
  if (!content) {
    return <p className="text-gray-400 italic">No performance data available for {leagueName}.</p>;
  }

  const contentLines = content.split('\\n').map(line => line.trim()).filter(line => line.length > 0);

  return (
    <article className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
      <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        Performance Data - {leagueName}
      </h3>
      <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed space-y-3">
        {contentLines.length > 0 ? (
          contentLines.map((line, index) => (
            <p key={index} className="mb-2 p-3 bg-gray-700/50 rounded-md">{line}</p>
          ))
        ) : (
           <p>{content.trim()}</p>
        )}
      </div>
    </article>
  );
};

export default PerformanceDataDisplay;
