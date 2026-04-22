import React, { useState, useEffect } from 'react';
import { NATIONS } from '../constants';
import { Nation } from '../types';
import * as geminiService from '../services/geminiService';

export const getTeamLogoUrl = (teamName: string): string => {
  const nation = NATIONS.find((n: Nation) => 
    n.name.toLowerCase().includes(teamName.toLowerCase()) || 
    teamName.toLowerCase().includes(n.id.toLowerCase())
  );

  if (nation) {
    const code = nation.countryCode === 'GB-ENG' ? 'gb-eng' : nation.countryCode.toLowerCase();
    return `https://flagcdn.com/w160/${code}.png`;
  }

  // Fallback for club teams
  const domain = teamName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + '.com';
  return `https://logo.clearbit.com/${domain}`;
};

interface TeamLogoProps {
  teamName: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({ teamName, className, fallback }) => {
  const [error, setError] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLogo = async () => {
      const nation = NATIONS.find((n: Nation) => 
        n.name.toLowerCase().includes(teamName.toLowerCase()) || 
        teamName.toLowerCase().includes(n.id.toLowerCase())
      );
      
      if (!nation) {
        const logo = await geminiService.fetchTeamLogo(teamName);
        if (logo) setCustomLogo(logo);
      }
    };
    fetchLogo();
  }, [teamName]);

  const logoUrl = customLogo || getTeamLogoUrl(teamName);
  
  // Strip everything except alphanumeric characters and spaces to avoid URI malformed errors with emojis/surrogates
  const cleanName = teamName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const initials = (cleanName || 'FC').split(/\s+/).filter(Boolean).map(n => [...n][0]).join('').substring(0, 2).toUpperCase();
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || 'FC')}&background=random&color=fff&size=128&bold=true`;

  if (error && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return (
    <img 
      src={error ? fallbackUrl : logoUrl} 
      alt={teamName} 
      className={className}
      onError={() => setError(true)}
      referrerPolicy="no-referrer"
    />
  );
};
