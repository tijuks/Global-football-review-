
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Prediction } from '../types';

interface PredictionsDisplayProps {
  predictions: Prediction[] | null;
  entityName: string;
}

const PredictionsDisplay: React.FC<PredictionsDisplayProps> = ({ predictions, entityName }) => {
  const { t } = useTranslation();
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center bg-gray-800/50 p-8 rounded-xl">
        <h3 className="text-2xl font-semibold text-gray-300 mb-2">No Predictions Available</h3>
        <p className="text-gray-400">Gemini could not generate specific forecasts for {entityName} matches at this time.</p>
      </div>
    );
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <article className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          {t('match.forecasts')}
        </h3>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{t('match.experimental')}</span>
        </div>
      </div>

      <div className="space-y-6">
        {predictions.map((pred, idx) => (
          <div key={idx} className="bg-gray-900/60 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all group">
            <div className="p-5 flex flex-col md:flex-row md:items-center gap-6">
              {/* Teams & Score */}
              <div className="flex-1">
                <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                  <div className="flex-1 text-right md:flex-initial">
                    <p className="text-lg font-bold text-white truncate">{pred.homeTeam}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">VS</span>
                    {pred.suggestedScore && (
                      <span className="px-2 py-0.5 bg-gray-800 rounded text-xs font-mono text-emerald-400 border border-white/5">
                        {pred.suggestedScore}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left md:flex-initial">
                    <p className="text-lg font-bold text-white truncate">{pred.awayTeam}</p>
                  </div>
                </div>
                <div className="mt-4 bg-black/20 p-3 rounded-xl border border-white/5">
                    <p className="text-sm text-gray-400 italic">"{pred.reasoning}"</p>
                </div>
              </div>

              {/* Prediction Details */}
              <div className="md:w-48 flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 gap-3">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{t('match.ai_pick')}</p>
                  <p className={`text-sm font-bold ${
                    pred.predictedOutcome === 'Home Win' ? 'text-emerald-400' : 
                    pred.predictedOutcome === 'Away Win' ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    {pred.predictedOutcome}
                  </p>
                </div>
                
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-gray-500">{t('match.confidence')}</span>
                    <span className="text-white">{pred.confidenceScore}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getConfidenceColor(pred.confidenceScore)} transition-all duration-1000`}
                      style={{ width: `${pred.confidenceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
        <p className="text-[10px] text-amber-500/60 leading-relaxed text-center italic">
          {t('match.disclaimer')}
        </p>
      </div>
    </article>
  );
};

export default PredictionsDisplay;
