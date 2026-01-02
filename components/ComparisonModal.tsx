
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlayerComparisonData, SelectableEntity } from '../types';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ComparisonModalProps {
  playerNames: string[];
  entity: SelectableEntity | null;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ playerNames, entity, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PlayerComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComp = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const compData = await geminiService.fetchPlayerComparison(playerNames, entity?.name || "Global Football");
        setData(compData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Comparison failed.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComp();
  }, [playerNames, entity]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4 sm:p-8">
      <div className="bg-gray-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            {t('head_to_head')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center"><LoadingSpinner /><p className="mt-4 text-gray-400">Gemini is analyzing the data...</p></div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : data ? (
            <div className="space-y-8">
              {/* Overall AI Analysis */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">{t('expert_verdict')}</h3>
                <p className="text-gray-200 leading-relaxed italic">"{data.overallAnalysis}"</p>
              </div>

              {/* Side by Side Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-${Math.min(data.players.length, 3)} gap-6`}>
                {data.players.map((player, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-2xl border border-white/5 p-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                      <p className="text-emerald-400 font-medium">{player.position} · {player.club}</p>
                    </div>

                    <div className="bg-emerald-500/10 rounded-lg p-3 border-l-4 border-emerald-500">
                      <p className="text-sm font-bold text-emerald-400 uppercase tracking-tighter">{t('player.trait')}</p>
                      <p className="text-white text-sm font-semibold">{player.comparisonVerdict}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('player.top_strengths')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {player.strengths.map(s => (
                          <span key={s} className="px-3 py-1 bg-gray-700/50 text-gray-200 text-xs rounded-full border border-white/5">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{t('player.recent_performance')}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{player.recentPerformance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
