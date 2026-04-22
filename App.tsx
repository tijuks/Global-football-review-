
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ReviewPanel from './components/ReviewPanel';
import PlayerProfileModal from './components/PlayerProfileModal';
import ComparisonTray from './components/ComparisonTray';
import ComparisonModal from './components/ComparisonModal';
import ApiKeyModal from './components/ApiKeyModal';
import AIChatBot from './components/AIChatBot';
import ErrorBoundary from './components/captureownerstack';
import { SelectableEntity, ViewMode, RealtimeMatch, GroundingSource } from './types';
import * as geminiService from './services/geminiService';
import { fetchGroundedRealtimeData } from './services/realtimeDatabase';

const App: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<SelectableEntity | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [realtimeMatches, setRealtimeMatches] = useState<RealtimeMatch[] | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [errorReview, setErrorReview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('leagues');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Player Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Comparison State
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isShowingComparison, setIsShowingComparison] = useState(false);

  // API Key State
  const [isShowingApiKeyModal, setIsShowingApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('GEMINI_API_KEY') || '');

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem('GEMINI_API_KEY', key);
    setApiKey(key);
  };

  const handleSelectEntity = useCallback((entity: SelectableEntity) => {
    setSelectedEntity(entity);
    setReview(null); 
    setRealtimeMatches(null);
    setGroundingSources([]);
    setErrorReview(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEntity(null);
  }, []);
  
  const handleViewChange = useCallback((mode: ViewMode) => {
    if (viewMode !== mode) {
      setViewMode(mode);
      clearSelection();
    }
  }, [viewMode, clearSelection]);

  const handlePlayerSearch = useCallback((playerName: string) => {
    setSelectedPlayer(playerName);
  }, []);

  const handleAddToCompare = useCallback((name: string) => {
    setComparisonList((prev: string[]) => {
      if (prev.includes(name)) return prev;
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, name];
    });
  }, []);

  const handleRemoveFromCompare = useCallback((name: string) => {
    setComparisonList((prev: string[]) => prev.filter((n: string) => n !== name));
  }, []);

  const handleClearComparison = useCallback(() => {
    setComparisonList([]);
  }, []);

  useEffect(() => {
    if (selectedEntity) {
      setIsLoadingReview(true);
      setErrorReview(null); 

      if(selectedEntity.type === 'realtime') {
        const fetchMatches = async () => {
            setReview(null);
            setRealtimeMatches(null);
            setGroundingSources([]);
            try {
                const data = await fetchGroundedRealtimeData(selectedEntity.promptFocus);
                setRealtimeMatches(data.matches);
                setGroundingSources(data.sources);
            } catch (err) {
                 setErrorReview(err instanceof Error ? err.message : 'An unexpected error occurred while fetching live data.');
            } finally {
                setIsLoadingReview(false);
            }
        };
        fetchMatches();
      } else {
         const fetchEntityReview = async () => {
            setRealtimeMatches(null);
            setReview(null); 
            setGroundingSources([]);
            try {
              const prompt = geminiService.generateLeagueReviewPrompt(selectedEntity.promptFocus);
              const reviewText = await geminiService.fetchReview(prompt);
              setReview(reviewText);
            } catch (err) {
              setErrorReview(err instanceof Error ? err.message : 'An unknown error occurred.');
              setReview(null);
            } finally {
              setIsLoadingReview(false);
            }
          };
          fetchEntityReview();
      }
    } else {
      setReview(null);
      setRealtimeMatches(null);
      setGroundingSources([]);
      setErrorReview(null);
      setIsLoadingReview(false);
    }
  }, [selectedEntity]);

  return (
    <ErrorBoundary fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-chocolate-dark text-white p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Something went wrong</h2>
          <p className="text-gray-400 text-sm mb-8">The application encountered an unexpected error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-pitch-green hover:bg-pitch-green-light text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
          >
            Refresh Application
          </button>
        </div>
      </div>
    }>
      <div className="flex flex-col h-screen bg-gradient-to-br from-chocolate-dark via-chocolate to-pitch-green-dark relative overflow-hidden">
        <Header 
          onSearchPlayer={handlePlayerSearch} 
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            selectedEntity={selectedEntity} 
            onSelectEntity={handleSelectEntity} 
            viewMode={viewMode}
            onViewChange={handleViewChange}
            isOpen={isSidebarOpen}
          />
          <ReviewPanel 
            entity={selectedEntity} 
            review={review}
            realtimeMatches={realtimeMatches} 
            groundingSources={groundingSources}
            isLoadingReview={isLoadingReview} 
            errorReview={errorReview} 
            viewMode={viewMode}
            onSelectEntity={handleSelectEntity}
            onPlayerClick={handlePlayerSearch}
          />
        </div>

        <ComparisonTray 
          players={comparisonList} 
          onRemove={handleRemoveFromCompare} 
          onCompare={() => setIsShowingComparison(true)}
          onClear={handleClearComparison}
        />

        {selectedPlayer && (
          <PlayerProfileModal
            playerName={selectedPlayer}
            entity={selectedEntity || { name: 'Global Football', type: 'league' } as any}
            onClose={() => setSelectedPlayer(null)}
            onAddToCompare={handleAddToCompare}
            isInComparison={comparisonList.includes(selectedPlayer)}
          />
        )}

        {isShowingComparison && (
          <ComparisonModal 
            playerNames={comparisonList}
            onClose={() => setIsShowingComparison(false)}
          />
        )}

        {isShowingApiKeyModal && (
          <ApiKeyModal
            initialKey={apiKey}
            onSave={handleSaveApiKey}
            onClose={() => setIsShowingApiKeyModal(false)}
          />
        )}
        
        <AIChatBot />
      </div>
    </ErrorBoundary>
  );
};

export default App;
