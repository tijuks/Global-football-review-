import React, { useState, useEffect, useCallback } from 'react';
import { SelectableEntity, TabId, MatchInfo, RealtimeMatch } from '../types';
import { TABS } from '../constants';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import Tabs from './Tabs'; 
import FixturesDisplay from './FixturesDisplay'; 
import CalendarDisplay from './CalendarDisplay';
import HighlightsDisplay from './HighlightsDisplay'; 
import InsightsDisplay from './InsightsDisplay'; 
import PerformanceDataDisplay from './PerformanceDataDisplay'; 
import BettingStrategyDisplay from './BettingStrategyDisplay';
import InteractiveText from './InteractiveText';
import TacticsDisplay from './TacticsDisplay';
import NationDatabase from './NationDatabase';
import { ViewMode } from '../types';
import MatchAnalysisModal from './MatchAnalysisModal';
import RealtimeMatchesDisplay from './RealtimeMatchesDisplay';

interface ReviewPanelProps {
  entity: SelectableEntity | null;
  review: string | null;
  realtimeMatches: RealtimeMatch[] | null;
  isLoadingReview: boolean;
  errorReview: string | null;
  viewMode: ViewMode;
  onSelectEntity: (entity: SelectableEntity) => void;
  onPlayerClick: (playerName: string) => void;
}

type TabContentState = {
  data: any;
  isLoading: boolean;
  error: string | null;
};

type AllTabsState = {
  [key in TabId]?: TabContentState;
};

const ReviewPanel: React.FC<ReviewPanelProps> = ({ entity, review, realtimeMatches, isLoadingReview, errorReview, viewMode, onSelectEntity, onPlayerClick }) => {
  const [activeTab, setActiveTab] = useState<TabId>('review');
  const [tabsContent, setTabsContent] = useState<AllTabsState>({});
  const [analyzingMatch, setAnalyzingMatch] = useState<MatchInfo | null>(null);

  useEffect(() => {
    setActiveTab('review');
    setTabsContent({});
    setAnalyzingMatch(null);
  }, [entity]);

  const handleOpenAnalysisModal = (match: MatchInfo) => {
    setAnalyzingMatch(match);
  };

  const handleCloseAnalysisModal = () => {
    setAnalyzingMatch(null);
  };

  const loadTabData = useCallback(async (tabId: TabId) => {
    if (!entity || (tabsContent[tabId] && tabsContent[tabId]?.data)) return;

    let fetchFunction: (promptOrFocus: string) => Promise<any>;
    let promptFunction: ((entityFocus: string) => string) | null = null;
    
    const setTabState = (state: Partial<TabContentState>) => {
        setTabsContent(prev => ({
            ...prev,
            [tabId]: { ...prev[tabId], ...state } as TabContentState
        }));
    };

    switch (tabId) {
      case 'fixtures':
        fetchFunction = geminiService.fetchFixtures;
        promptFunction = geminiService.generateFixturesPrompt;
        break;
      case 'calendar':
        fetchFunction = geminiService.fetchCalendar;
        promptFunction = geminiService.generateCalendarPrompt;
        break;
      case 'highlights':
        fetchFunction = geminiService.fetchHighlights;
        promptFunction = geminiService.generateHighlightsPrompt;
        break;
      case 'insights':
        fetchFunction = geminiService.fetchInsights;
        promptFunction = geminiService.generateInsightsPrompt;
        break;
      case 'performance':
        fetchFunction = geminiService.fetchPerformanceData;
        promptFunction = geminiService.generatePerformanceDataPrompt;
        break;
      case 'betting':
        fetchFunction = geminiService.fetchBettingInfo;
        promptFunction = geminiService.generateBettingInfoPrompt;
        break;
      case 'tactics':
        fetchFunction = () => geminiService.fetchTacticalFormation(entity.promptFocus);
        promptFunction = null;
        break;
      default:
        return;
    }

    setTabState({ isLoading: true, error: null });
    try {
      const prompt = promptFunction ? promptFunction(entity.promptFocus) : entity.promptFocus;
      const data = await fetchFunction(prompt);
      setTabState({ data, isLoading: false });
    } catch (err) {
      setTabState({ isLoading: false, error: err instanceof Error ? err.message : 'An unknown error occurred.' });
    }
  }, [entity, tabsContent]);

  useEffect(() => {
    if (entity && entity.type !== 'realtime' && activeTab !== 'review') {
      loadTabData(activeTab);
    }
  }, [activeTab, entity, loadTabData]);

  const renderRealtimeContent = () => {
    if (isLoadingReview) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
    if (errorReview) return <div className="mt-8"><ErrorMessage message={errorReview} /></div>;
    if (realtimeMatches && entity) {
      return <RealtimeMatchesDisplay matches={realtimeMatches} title={entity.name} onAnalyzeMatch={handleOpenAnalysisModal} />;
    }
    return (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">Real-time Football Data</h2>
          <p className="text-xl text-gray-400">Select a category from the sidebar to view matches.</p>
        </div>
    );
  };

  const renderTabContent = () => {
    if (!entity) {
      if (viewMode === 'nations') {
        return <NationDatabase onSelectNation={onSelectEntity} />;
      }
      if (viewMode === 'realtime') {
        return renderRealtimeContent();
      }
      return (
        <div className="text-center mt-20">
          <h2 className="text-3xl font-semibold text-gray-300 mb-4">Welcome to the Football Review Hub!</h2>
          <p className="text-xl text-gray-400">Select a league or nation from the sidebar to get started.</p>
        </div>
      );
    }
    
    if(entity.type === 'realtime') {
        return renderRealtimeContent();
    }

    const tabState = tabsContent[activeTab];

    switch (activeTab) {
      case 'review':
        if (isLoadingReview) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
        if (errorReview) return <div className="mt-8"><ErrorMessage message={errorReview} /></div>;
        if (review) return (
            <article className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl">
                <div className="flex items-center mb-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
                    {entity.name} Review
                </h2>
                </div>
                <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
                   <InteractiveText text={review} onPlayerClick={onPlayerClick} />
                </div>
            </article>
        );
        return null;
        
      case 'fixtures':
      case 'calendar':
      case 'highlights':
      case 'insights':
      case 'performance':
      case 'betting':
      case 'tactics':
         if (tabState?.isLoading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;
         if (tabState?.error) return <div className="mt-8"><ErrorMessage message={tabState.error} /></div>;
         
         switch(activeTab) {
            case 'fixtures': return <FixturesDisplay content={tabState?.data} leagueName={entity.name} onAnalyzeMatch={handleOpenAnalysisModal} />;
            case 'calendar': return <CalendarDisplay fixtures={tabState?.data} entityName={entity.name} onAnalyzeMatch={handleOpenAnalysisModal} />;
            case 'highlights': return <HighlightsDisplay content={tabState?.data} leagueName={entity.name} onPlayerClick={onPlayerClick} />;
            case 'insights': return <InsightsDisplay content={tabState?.data} leagueName={entity.name} onPlayerClick={onPlayerClick} />;
            case 'performance': return <PerformanceDataDisplay content={tabState?.data} leagueName={entity.name} />;
            case 'betting': return <BettingStrategyDisplay content={tabState?.data} leagueName={entity.name} />;
            case 'tactics': return <TacticsDisplay tacticalData={tabState?.data} leagueName={entity.name} />;
         }
         return null;

      default:
        return null;
    }
  };

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-gray-800/30 backdrop-blur-md flex flex-col">
      {entity && entity.type !== 'realtime' && (
        <div className="mb-6">
          <Tabs tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}
      <div className="max-w-4xl mx-auto w-full flex-grow">
        {renderTabContent()}
      </div>
      {analyzingMatch && (
        <MatchAnalysisModal 
            match={analyzingMatch}
            onClose={handleCloseAnalysisModal}
            onPlayerClick={onPlayerClick}
        />
      )}
    </main>
  );
};

export default ReviewPanel;