
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { SelectableEntity, ViewMode, Confederation, League, Nation } from '../types';
import { LEAGUES, NATIONS, REALTIME_CATEGORIES } from '../constants';
import { TeamLogo } from './TeamLogo';

import { SupportModal } from './SupportModal';

interface SidebarProps {
  selectedEntity: SelectableEntity | null;
  onSelectEntity: (entity: SelectableEntity) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedEntity, onSelectEntity, viewMode, onViewChange, isOpen }) => {
  const { t } = useTranslation();
  const [confederationFilter, setConfederationFilter] = useState<Confederation | 'All'>('All');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleViewChange = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onViewChange(mode);
      setConfederationFilter('All');
      setOnlyPopular(false);
      setLocalSearch('');
    }
  };
  
  const filteredEntities = useMemo(() => {
      let base: SelectableEntity[] = [];
      switch(viewMode) {
          case 'leagues': base = LEAGUES; break;
          case 'nations': base = NATIONS; break;
          case 'realtime': base = REALTIME_CATEGORIES; break;
          default: base = [];
      }

      let filtered = [...base];

      if (onlyPopular) {
        filtered = filtered.filter(e => {
            if (e.type === 'league') return (e as League).isPopular === true;
            if (e.type === 'nation') return (e as Nation).isPopular === true;
            return true;
        });
      }

      if (localSearch.trim()) {
        filtered = filtered.filter(e => e.name.toLowerCase().includes(localSearch.toLowerCase()));
      }

      if (viewMode === 'leagues') {
        let leagues = filtered as League[];
        if (confederationFilter !== 'All') {
          leagues = leagues.filter(l => l.confederation === confederationFilter || l.id === 'others');
        }
        return leagues;
      }

      if (viewMode === 'nations') {
        if (confederationFilter !== 'All') {
          return filtered.filter(n => (n as Nation).confederation === confederationFilter);
        }
      }

      return filtered;
  }, [viewMode, confederationFilter, onlyPopular, localSearch]);

  const NavItem: React.FC<{ emoji: string, label: string, active?: boolean, onClick?: () => void }> = ({ emoji, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all border ${
        active 
        ? 'bg-pitch-green/20 border-pitch-green/30 text-pitch-green-light shadow-[inset_0_0_20px_rgba(46,125,50,0.1)]' 
        : 'bg-transparent border-transparent text-gray-500 hover:bg-chocolate hover:text-gray-100'
      }`}
    >
      <span className="text-lg">{emoji}</span>
      <span className="truncate">{label}</span>
    </button>
  );

  const EntityItem: React.FC<{ entity: SelectableEntity }> = ({ entity }) => {
    const isActive = selectedEntity?.id === entity.id;
    
    const getEntityEmoji = () => {
      if (entity.type === 'league') return '🏆';
      if (entity.type === 'nation') return '🚩';
      return '⚽';
    };

    return (
      <button
        onClick={() => onSelectEntity(entity)}
        className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
          isActive 
          ? 'bg-pitch-green border-pitch-green-light text-white shadow-lg shadow-pitch-green-dark/40 scale-[1.02]' 
          : 'bg-chocolate-dark/40 border-white/5 text-gray-400 hover:border-pitch-green/30 hover:text-pitch-green-light'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {entity.type === 'realtime' ? (
            <span className="text-sm">{getEntityEmoji()}</span>
          ) : (
            <TeamLogo 
                teamName={entity.name} 
                className="w-5 h-5 rounded-full object-cover" 
                fallback={<span className="text-sm">{getEntityEmoji()}</span>}
            />
          )}
          <span className="truncate">{entity.name}</span>
        </div>
        {isActive && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        )}
      </button>
    );
  };

  const confederations: (Confederation | 'All')[] = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 288 : 0, opacity: isOpen ? 1 : 0 }}
      className="bg-chocolate-dark border-r border-chocolate flex flex-col h-full overflow-hidden"
    >
      <div className="p-5 border-b border-chocolate bg-chocolate/10 w-72">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pitch-green to-chocolate flex items-center justify-center text-white text-xl shadow-lg ring-2 ring-pitch-green/20">
            🏟️
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-100">Football Hub</span>
            <span className="text-[10px] text-pitch-green-light font-black uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar flex flex-col w-72">
        <section className="space-y-1">
          <NavItem 
            label={t('leagues')} 
            active={viewMode === 'leagues'} 
            onClick={() => handleViewChange('leagues')}
            emoji="⚽" 
          />
          <NavItem 
            label={t('nations')} 
            active={viewMode === 'nations'} 
            onClick={() => handleViewChange('nations')}
            emoji="🌎" 
          />
          <NavItem 
            label={t('match_center')} 
            active={viewMode === 'realtime'} 
            onClick={() => handleViewChange('realtime')}
            emoji="🏟️" 
          />
          <NavItem 
            label="Discussion" 
            active={viewMode === 'discussion'} 
            onClick={() => handleViewChange('discussion')}
            emoji="💬" 
          />
          <NavItem 
            label="Contact" 
            active={viewMode === 'contact'} 
            onClick={() => handleViewChange('contact')}
            emoji="✉️" 
          />
        </section>

        <div className="space-y-4 flex flex-col flex-1 min-h-0">
          {(viewMode === 'leagues' || viewMode === 'nations') && (
            <section className="bg-chocolate/50 rounded-2xl p-3 border border-chocolate-light/20 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Quick Filters</h3>
                <button 
                  onClick={() => setOnlyPopular(!onlyPopular)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all border ${
                    onlyPopular 
                    ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500 shadow-lg shadow-yellow-900/20' 
                    : 'bg-chocolate border-transparent text-gray-500 hover:text-gray-400'
                  }`}
                >
                  <span className="text-xs">{onlyPopular ? '⭐' : '☆'}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Popular</span>
                </button>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {confederations.map((conf: Confederation | 'All') => (
                  <button
                    key={conf}
                    onClick={() => setConfederationFilter(conf)}
                    className={`
                      px-2 py-1 rounded-lg text-[8px] font-black tracking-widest transition-all uppercase border
                      ${confederationFilter === conf 
                        ? 'bg-pitch-green border-pitch-green-light text-white' 
                        : 'bg-chocolate border-transparent text-gray-500 hover:text-gray-300'
                      }
                    `}
                  >
                    {conf}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input 
                  type="text" 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={`Search ${viewMode}...`}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-2 px-3 text-[10px] text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-pitch-green/50 transition-all"
                />
              </div>
            </section>
          )}

          <section className="flex-1 min-h-0 flex flex-col">
            <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-black text-gray-600">
              {viewMode === 'realtime' ? 'Status' : 'Selection'}
            </h3>
            <div className="space-y-1.5 overflow-y-auto pr-1 custom-scrollbar pb-4">
              {filteredEntities.length > 0 ? (
                filteredEntities.map((entity: SelectableEntity) => (
                  <EntityItem key={entity.id} entity={entity} />
                ))
              ) : (
                <div className="px-3 py-10 text-center bg-gray-900/20 rounded-3xl border border-dashed border-gray-800/50">
                  <div className="text-2xl mb-2">🤷‍♂️</div>
                  <p className="text-[10px] text-gray-600 italic">No matches found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="p-4 bg-chocolate-dark border-t border-chocolate w-72">
        <button
          onClick={() => setIsSupportModalOpen(true)}
          className="w-full bg-pitch-green hover:bg-pitch-green-light text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-3"
        >
          Support the Project
        </button>
        <div className="bg-pitch-green/5 rounded-xl p-3 border border-pitch-green/10 text-center">
          <p className="text-[9px] text-pitch-green-light font-black uppercase tracking-widest">
            Powered by Gemini 3 Flash
          </p>
        </div>
      </div>
      <SupportModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} />
    </motion.aside>
  );
};

export default Sidebar;
