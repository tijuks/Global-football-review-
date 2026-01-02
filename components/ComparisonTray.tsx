
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ComparisonTrayProps {
  players: string[];
  onRemove: (name: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

const ComparisonTray: React.FC<ComparisonTrayProps> = ({ players, onRemove, onCompare, onClear }) => {
  const { t } = useTranslation();
  if (players.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-bounce-in">
      <div className="bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex items-center gap-4 min-w-[320px] max-w-full">
        <div className="flex -space-x-3 overflow-hidden">
          {players.map((name, i) => (
            <div 
              key={name} 
              className="relative group h-12 w-12 rounded-full border-2 border-gray-900 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-lg"
              title={name}
            >
              {name.split(' ').map(n => n[0]).join('')}
              <button 
                onClick={() => onRemove(name)}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform shadow-md"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{players.length} {t('player.selected')}</span>
          <span className="text-sm font-semibold text-white">{t('head_to_head')}</span>
        </div>

        <div className="flex gap-2 ml-auto">
          <button 
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            {t('player.clear')}
          </button>
          <button 
            onClick={onCompare}
            disabled={players.length < 2}
            className={`
              px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-lg
              ${players.length >= 2 
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20' 
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
            `}
          >
            {t('player.compare_now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTray;
