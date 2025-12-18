
import React, { useState, useEffect, useCallback } from 'react';
import { MatchInfo, AnalysisType } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import InteractiveText from './InteractiveText';

interface MatchAnalysisModalProps {
  match: MatchInfo;
  onClose: () => void;
  onPlayerClick: (playerName: string) => void;
}

interface AnalysisContent {
  data: string | null;
  isLoading: boolean;
  error: string | null;
}

const MatchAnalysisModal: React.FC<MatchAnalysisModalProps> = ({ match, onClose, onPlayerClick }) => {
  const initialTab: AnalysisType = match.isFuture ? 'pre-match' : 'post-match';
  const [activeTab, setActiveTab] = useState<AnalysisType>(initialTab);
  const [analysisContent, setAnalysisContent] = useState<Record<AnalysisType, AnalysisContent>>({
    'pre-match': { data: null, isLoading: false, error: null },
    'halftime': { data: null, isLoading: false, error: null },
    'post-match': { data: null, isLoading: false, error: null },
  });

  const loadAnalysisData = useCallback(async (tab: AnalysisType) => {
    if (analysisContent[tab].data || analysisContent[tab].isLoading) {
      return;
    }

    setAnalysisContent(prev => ({
      ...prev,
      [tab]: { ...prev[tab], isLoading: true, error: null }
    }));

    let prompt = '';
    switch (tab) {
      case 'pre-match':
        prompt = geminiService.generatePreMatchAnalysisPrompt(match);
        break;
      case 'halftime':
        prompt = geminiService.generateHalftimeAnalysisPrompt(match);
        break;
      case 'post-match':
        prompt = geminiService.generatePostMatchAnalysisPrompt(match);
        break;
    }

    try {
      const data = await geminiService.fetchAnalysis(prompt);
      setAnalysisContent(prev => ({
        ...prev,
        [tab]: { data, isLoading: false, error: null }
      }));
    } catch (err) {
      setAnalysisContent(prev => ({
        ...prev,
        [tab]: { ...prev[tab], isLoading: false, error: err instanceof Error ? err.message : 'An unknown error occurred.' }
      }));
    }
  }, [match, analysisContent]);

  useEffect(() => {
    loadAnalysisData(activeTab);
  }, [activeTab, loadAnalysisData]);

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

  const renderContent = () => {
    const content = analysisContent[activeTab];
    if (content.isLoading) {
      return <div className="p-16"><LoadingSpinner /></div>;
    }
    if (content.error) {
      return <div className="p-8"><ErrorMessage message={content.error} /></div>;
    }
    if (content.data) {
      return (
        <div className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
            <InteractiveText text={content.data} onPlayerClick={onPlayerClick} />
        </div>
      );
    }
    return null;
  };

  const AnalysisTab: React.FC<{tabType: AnalysisType, label: string}> = ({ tabType, label }) => {
    const isDisabled = tabType === 'post-match' && match.isFuture;
    return (
        <button
            onClick={() => !isDisabled && setActiveTab(tabType)}
            disabled={isDisabled}
            className={`
                px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-60
                ${activeTab === tabType
                    ? 'border-green-500 border-b-2 text-green-400 bg-gray-800'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border-b-2 border-transparent'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            aria-current={activeTab === tabType ? 'page' : undefined}
            >
            {label}
        </button>
    );
  }

  return (
    <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-analysis-title"
    >
      <div 
        className="bg-gray-900/90 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700">
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                aria-label="Close match analysis"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 id="match-analysis-title" className="text-2xl sm:text-3xl font-bold text-white mb-1">{match.homeTeam} vs {match.awayTeam}</h2>
            <p className="text-md text-gray-400 font-semibold">{match.context}{match.score ? ` - Final Score: ${match.score}` : ''}</p>
        </div>
        
        <div className="px-6 border-b-2 border-gray-700">
            <nav className="flex space-x-1" aria-label="Analysis Tabs">
                <AnalysisTab tabType="pre-match" label="Pre-Match" />
                <AnalysisTab tabType="halftime" label="Halftime" />
                <AnalysisTab tabType="post-match" label="Post-Match" />
            </nav>
        </div>
        
        <div className="p-6 flex-grow">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MatchAnalysisModal;
