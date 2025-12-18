
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ReviewPanel from './components/ReviewPanel';
import PlayerProfileModal from './components/PlayerProfileModal';
import ComparisonTray from './components/ComparisonTray';
import ComparisonModal from './components/ComparisonModal';
import { SelectableEntity, ViewMode, RealtimeMatch } from './types';
import * as geminiService from './services/geminiService';

const App: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<SelectableEntity | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const [realtimeMatches, setRealtimeMatches] = useState<RealtimeMatch[] | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);
  const [errorReview, setErrorReview] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('leagues');
  
  // Player Modal State
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  // Comparison State
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isShowingComparison, setIsShowingComparison] = useState(false);

  const handleSelectEntity = useCallback((entity: SelectableEntity) => {
    setSelectedEntity(entity);
    setReview(null); 
    setRealtimeMatches(null);
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
    setComparisonList(prev => {
      if (prev.includes(name)) return prev;
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, name];
    });
  }, []);

  const handleRemoveFromCompare = useCallback((name: string) => {
    setComparisonList(prev => prev.filter(n => n !== name));
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
            try {
                const prompt = geminiService.generateRealtimeMatchesPrompt(selectedEntity.promptFocus);
                const matches = await geminiService.fetchRealtimeMatches(prompt);
                setRealtimeMatches(matches);
            } catch (err) {
                 setErrorReview(err instanceof Error ? err.message : 'An unknown error occurred while fetching matches.');
            } finally {
                setIsLoadingReview(false);
            }
        };
        fetchMatches();
      } else {
         const fetchEntityReview = async () => {
            setRealtimeMatches(null);
            setReview(null); 
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
      setErrorReview(null);
      setIsLoadingReview(false);
    }
  }, [selectedEntity]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950 relative overflow-hidden">
      <Header onSearchPlayer={handlePlayerSearch} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          selectedEntity={selectedEntity} 
          onSelectEntity={handleSelectEntity} 
          viewMode={viewMode}
          onViewChange={handleViewChange}
        />
        <ReviewPanel 
          entity={selectedEntity} 
          review={review}
          realtimeMatches={realtimeMatches} 
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
          entity={selectedEntity}
          onClose={() => setIsShowingComparison(false)}
        />
      )}
    </div>
  );
};

export default App;
