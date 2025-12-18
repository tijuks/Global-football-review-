
import React, { Fragment } from 'react';

interface InteractiveTextProps {
  text: string;
  onPlayerClick: (playerName: string) => void;
  paragraphClassName?: string;
}

const InteractiveText: React.FC<InteractiveTextProps> = ({ text, onPlayerClick, paragraphClassName }) => {
  if (!text) return null;

  // Regex to find [[Player Name]] and capture "Player Name"
  const playerRegex = /\[\[(.*?)\]\]/g;

  // Split the text into paragraphs
  const paragraphs = text.split(/\\n\\n|\n\n/).map(p => p.trim()).filter(p => p.length > 0);

  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        const parts = paragraph.split(playerRegex);
        
        return (
          <p key={pIndex} className={paragraphClassName || "mb-4"}>
            {parts.map((part, index) => {
              // Every odd-indexed part is a captured player name
              if (index % 2 === 1) {
                return (
                  <button
                    key={index}
                    onClick={() => onPlayerClick(part)}
                    className="bg-green-600 hover:bg-green-500 text-white font-semibold py-1 px-2 rounded-md transition-colors duration-150 mx-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-400"
                    aria-label={`View profile for ${part}`}
                  >
                    {part}
                  </button>
                );
              }
              // Even-indexed parts are the surrounding text
              return <Fragment key={index}>{part}</Fragment>;
            })}
          </p>
        );
      })}
    </>
  );
};

export default InteractiveText;
