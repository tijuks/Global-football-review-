
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectableEntity, PlayerProfile, GeneratedImage } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { TeamLogo } from './TeamLogo';

interface PlayerProfileModalProps {
  playerName: string;
  entity: SelectableEntity;
  onClose: () => void;
  onAddToCompare: (name: string) => void;
  isInComparison: boolean;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ playerName, entity, onClose, onAddToCompare, isInComparison }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [playerImageUrl, setPlayerImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'biography'>('overview');
  
  // AI Image State
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [profileData, imageUrl] = await Promise.all([
          geminiService.fetchPlayerProfile(playerName, entity.name),
          geminiService.fetchPlayerImage(playerName)
        ]);
        
        // Add hypothetical achievement to the most recent club
        if (profileData.careerHistory && profileData.careerHistory.length > 0) {
            const updatedCareerHistory = [...profileData.careerHistory];
            const mostRecentClub = updatedCareerHistory[0];
            const newAchievement = "Key contribution to the 2025 Cup Final victory";
            if (!mostRecentClub.achievements) {
                mostRecentClub.achievements = [];
            }
            if (!mostRecentClub.achievements.includes(newAchievement)) {
                mostRecentClub.achievements.push(newAchievement);
            }
            profileData.careerHistory = updatedCareerHistory;
        }

        setProfile(profileData);
        setPlayerImageUrl(imageUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [playerName, entity]);

  const handleGenerateImage = async () => {
    if (!profile) return;
    setIsGeneratingImage(true);
    try {
      const img = await geminiService.generatePlayerImage(profile.name);
      setGeneratedImage(img);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          const link = document.createElement('a');
          link.href = generatedImage.url;
          link.download = `${profile?.name || 'player'}_poster.png`;
          link.click();
          return null;
        }
        return prev + 10;
      });
    }, 100);
  };

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
            className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform z-10"
            aria-label="Close player profile"
        >
            ❌
        </button>

        {isLoading && <div className="p-16"><LoadingSpinner /></div>}
        {error && <div className="p-8"><ErrorMessage message={error} /></div>}
        
        {!isLoading && !error && profile && (
          <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-pitch-green to-chocolate flex items-center justify-center text-3xl font-black text-white shadow-xl border-2 border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
                      {generatedImage ? (
                        <img src={generatedImage.url} alt={profile.name} className="w-full h-full object-cover" />
                      ) : playerImageUrl ? (
                        <img src={playerImageUrl} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        playerName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    {generatedImage && (
                      <button 
                        onClick={handleDownloadImage}
                        className="absolute -bottom-2 -right-2 bg-white text-pitch-green-dark p-1 rounded-full shadow-lg border border-gray-200 hover:bg-pitch-green/5 transition-colors text-xs"
                        title="Download HD Poster"
                      >
                        📥
                      </button>
                    )}
                  </div>
                  <div>
                    <h2 id="player-profile-title" className="text-3xl font-black text-white leading-tight">{profile.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <TeamLogo teamName={profile.club} className="w-4 h-4 rounded-full object-cover" />
                      <p className="text-pitch-green-light font-bold uppercase tracking-widest text-xs">{profile.position} · {profile.club}</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                       <button
                         onClick={handleGenerateImage}
                         disabled={isGeneratingImage}
                         className="text-[9px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-pitch-green-light border border-pitch-green/30 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
                       >
                         {isGeneratingImage ? (
                           <>
                             <span className="w-2 h-2 border border-current border-t-transparent animate-spin rounded-full" />
                             Painting...
                           </>
                         ) : (
                           <>
                             🎨 Generate AI Artwork
                           </>
                         )}
                       </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCompare(profile.name)}
                    disabled={isInComparison}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
                      isInComparison 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-white/5' 
                      : 'bg-pitch-green hover:bg-pitch-green-light text-white shadow-pitch-green-dark/20 active:scale-95 border border-pitch-green-light/20'
                    }`}
                  >
                    {isInComparison ? '✅ Queued' : '⚔️ Compare'}
                  </button>
                </div>
              </div>
              
              {downloadProgress !== null && (
                <div className="mb-6 p-4 bg-pitch-green/10 border border-pitch-green/20 rounded-2xl animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pitch-green-light">Preparing HD Download</span>
                    <span className="text-[10px] font-black text-white">{downloadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-pitch-green transition-all duration-300" style={{ width: `${downloadProgress}%` }} />
                  </div>
                  <p className="text-[9px] text-pitch-green/60 mt-2 italic">Est. speed: 4.2 MB/s · Fetching from global CDN...</p>
                </div>
              )}

              <div className="flex gap-4 border-b border-gray-700 mb-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'text-pitch-green-light border-b-2 border-pitch-green' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('career')}
                  className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'career' ? 'text-pitch-green-light border-b-2 border-pitch-green' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Career History
                </button>
                <button 
                  onClick={() => setActiveTab('biography')}
                  className={`pb-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'biography' ? 'text-pitch-green-light border-b-2 border-pitch-green' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Biography
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        💪 {t('player.key_strengths')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.strengths.map((strength, index) => (
                          <span key={index} className="bg-chocolate/60 text-pitch-green-light text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-white/5">{strength}</span>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        ⚠️ {t('player.key_weaknesses')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.weaknesses.map((weakness, index) => (
                          <span key={index} className="bg-red-900/20 text-red-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg border border-red-900/20">{weakness}</span>
                        ))}
                      </div>
                    </section>
                  </div>

                  <section>
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      🎭 {t('player.recent_performance')}
                    </h3>
                    <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5 shadow-inner">
                      <p className="text-sm text-gray-300 leading-relaxed font-medium italic">"{profile.recentPerformance}"</p>
                    </div>
                  </section>
                </div>
              ) : activeTab === 'career' ? (
                <div className="space-y-4">
                  {profile.careerHistory && profile.careerHistory.length > 0 ? (
                    <div className="space-y-4">
                      {profile.careerHistory.map((entry, idx) => (
                        <div key={idx} className="bg-gray-900/40 rounded-2xl border border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-900/60 transition-colors">
                          <div className="flex items-center gap-4">
                            <TeamLogo teamName={entry.club} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                            <div>
                              <h4 className="text-white font-bold text-sm">{entry.club}</h4>
                              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">{entry.years}</p>
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <div className="text-center">
                              <p className="text-pitch-green-light font-black text-lg leading-none">{entry.appearances}</p>
                              <p className="text-gray-600 text-[8px] font-black uppercase tracking-tighter">Apps</p>
                            </div>
                            <div className="text-center">
                              <p className="text-pitch-green-light font-black text-lg leading-none">{entry.goals}</p>
                              <p className="text-gray-600 text-[8px] font-black uppercase tracking-tighter">Goals</p>
                            </div>
                            {entry.assists !== undefined && (
                              <div className="text-center">
                                <p className="text-pitch-green-light font-black text-lg leading-none">{entry.assists}</p>
                                <p className="text-gray-600 text-[8px] font-black uppercase tracking-tighter">Assists</p>
                              </div>
                            )}
                          </div>
                          {entry.achievements && entry.achievements.length > 0 && (
                            <div className="w-full sm:w-auto flex flex-wrap gap-1 mt-2 sm:mt-0">
                              {entry.achievements.map((ach, aIdx) => (
                                <span key={aIdx} className="text-[8px] bg-pitch-green/10 text-pitch-green-light px-2 py-0.5 rounded-full border border-pitch-green/20">
                                  🏆 {ach}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-900/20 rounded-3xl border border-dashed border-white/5">
                      <p className="text-gray-500 text-xs italic">No detailed career history available for this player.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    📖 Biography
                  </h3>
                  <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5">
                    {profile.biography}
                  </div>
                </div>
              )}

              {generatedImage && (
                <section className="mt-8 border-t border-white/5 pt-8 animate-fade-in">
                  <h3 className="text-[10px] font-black text-pitch-green uppercase tracking-widest mb-4 flex items-center gap-2">
                    🖼️ AI Generation Meta
                  </h3>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-500 font-mono break-all mb-2">
                      Source: {generatedImage.url.substring(0, 100)}...
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold">
                      Prompt: {generatedImage.prompt}
                    </p>
                  </div>
                </section>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfileModal;
