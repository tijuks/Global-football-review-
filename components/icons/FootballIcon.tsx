
import React from 'react';

interface FootballIconProps {
  className?: string;
}

const FootballIcon: React.FC<FootballIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className || "w-6 h-6"}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm-4-4h2v2H7v-2zm8 0h2v2h-2v-2zM4.93 4.93l1.41 1.41L4.93 7.76 3.51 6.34l1.42-1.41zm12.73 0l1.41 1.41-1.41 1.42-1.41-1.42 1.41-1.41zm-1.41 12.73l-1.41 1.41-1.42-1.41 1.42-1.41 1.41 1.41zm-10.31.01l-1.41-1.41L3.51 17.66l1.41 1.41 1.42-1.41z"/>
    </svg>
  );
};

export default FootballIcon;
