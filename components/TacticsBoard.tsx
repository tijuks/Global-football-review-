
import React from 'react';
import { PlayerPosition } from '../types';

interface TacticsBoardProps {
  players: PlayerPosition[];
}

const TacticsBoard: React.FC<TacticsBoardProps> = ({ players }) => {
  const viewBoxWidth = 400;
  const viewBoxHeight = 600;

  return (
    <div className="w-full bg-green-800 rounded-lg shadow-inner border-4 border-green-400/30 p-2">
        <svg 
            viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-auto"
            aria-label="A diagram of a football pitch showing player formation."
        >
            {/* Pitch background */}
            <rect width={viewBoxWidth} height={viewBoxHeight} fill="#059669" />

            {/* Pitch markings */}
            <g stroke="rgba(255,255,255,0.4)" strokeWidth="2">
                {/* Center circle */}
                <circle cx={viewBoxWidth / 2} cy={viewBoxHeight / 2} r="50" fill="none" />
                {/* Center line */}
                <line x1="0" y1={viewBoxHeight / 2} x2={viewBoxWidth} y2={viewBoxHeight / 2} />
                {/* Penalty box - top */}
                <rect x={viewBoxWidth * 0.2} y="0" width={viewBoxWidth * 0.6} height={viewBoxHeight * 0.18} fill="none" />
                {/* 6-yard box - top */}
                <rect x={viewBoxWidth * 0.35} y="0" width={viewBoxWidth * 0.3} height={viewBoxHeight * 0.08} fill="none" />
                {/* Penalty arc - top */}
                <path d={`M ${viewBoxWidth*0.4} ${viewBoxHeight*0.18} A 30 30 0 0 1 ${viewBoxWidth*0.6} ${viewBoxHeight*0.18}`} fill="none" />


                {/* Penalty box - bottom */}
                <rect x={viewBoxWidth * 0.2} y={viewBoxHeight * (1 - 0.18)} width={viewBoxWidth * 0.6} height={viewBoxHeight * 0.18} fill="none" />
                {/* 6-yard box - bottom */}
                <rect x={viewBoxWidth * 0.35} y={viewBoxHeight * (1 - 0.08)} width={viewBoxWidth * 0.3} height={viewBoxHeight * 0.08} fill="none" />
                {/* Penalty arc - bottom */}
                 <path d={`M ${viewBoxWidth*0.4} ${viewBoxHeight*(1 - 0.18)} A 30 30 0 0 0 ${viewBoxWidth*0.6} ${viewBoxHeight*(1 - 0.18)}`} fill="none" />
            </g>

            {/* Players */}
            <g>
                {players.map((player, index) => {
                    // Y is inverted for display (y=0 is top of screen, but bottom of our data)
                    const cx = (player.x / 100) * viewBoxWidth;
                    const cy = (1 - (player.y / 100)) * viewBoxHeight; 
                    const isGoalkeeper = player.position.toLowerCase().includes('goalkeeper');

                    return (
                        <g key={index} transform={`translate(${cx}, ${cy})`}>
                            <title>{player.position}</title>
                            <circle 
                                r="12" 
                                fill={isGoalkeeper ? "#FBBF24" : "#1F2937"} 
                                stroke="#FFFFFF" 
                                strokeWidth="2" 
                            />
                            <text 
                                textAnchor="middle" 
                                dy=".3em" 
                                fill={isGoalkeeper ? "#1F2937" : "#FFFFFF"} 
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {player.position.substring(0, 1)}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    </div>
  );
};

export default TacticsBoard;
