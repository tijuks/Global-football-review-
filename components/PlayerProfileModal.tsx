
import React, { useEffect, useState } from 'react';
import { SelectableEntity, PlayerProfile } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface PlayerProfileModalProps {
  playerName: string;
  entity: SelectableEntity;
  onClose: () => void;
  onAddToCompare: (name: string) => void;
  isInComparison: boolean;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ playerName, entity, onClose, onAddToCompare, isInComparison }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await geminiService.fetchPlayerProfile(playerName, entity.name);
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [playerName, entity]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-profile-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col relative border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Close player profile"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {isLoading && <div className="p-16"><LoadingSpinner /></div>}
        {error && <div className="p-8"><ErrorMessage message={error} /></div>}
        
        {!isLoading && !error && profile && (
          <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 id="player-profile-title" className="text-3xl sm:text-4xl font-bold text-white mb-1">{profile.name}</h2>
                  <p className="text-lg text-emerald-400 font-semibold">{profile.position} - {profile.club}</p>
                </div>
                <button
                  onClick={() => onAddToCompare(profile.name)}
                  disabled={isInComparison}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
                    isInComparison 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 active:scale-95'
                  }`}
                >
                  {isInComparison ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      Queued
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                      Compare
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">Key Strengths</h3>
                  <div className="flex flex-wrap gap-2">
                      {profile.strengths.map((strength, index) => (
                          <span key={index} className="bg-gray-700 text-emerald-300 text-sm font-medium px-3 py-1 rounded-full border border-white/5">{strength}</span>
                      ))}
                  </div>
              </div>

              <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-200 mb-2">Recent Performance</h3>
                  <p className="text-gray-300 leading-relaxed bg-gray-900/40 p-4 rounded-xl border border-white/5">{profile.recentPerformance}</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfileModal;
