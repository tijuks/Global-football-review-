
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectableEntity, ViewMode, Confederation, League, Nation } from '../types';
import { LEAGUES, NATIONS, REALTIME_CATEGORIES } from '../constants';

interface SidebarProps {
  selectedEntity: SelectableEntity | null;
  onSelectEntity: (entity: SelectableEntity) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedEntity, onSelectEntity, viewMode, onViewChange }) => {
  const { t } = useTranslation();
  const [confederationFilter, setConfederationFilter] = useState<Confederation | 'All'>('All');
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [localSearch, setLocalSearch] = useState('');

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

      // Filter by search
      if (localSearch.trim()) {
        filtered = filtered.filter(e => e.name.toLowerCase().includes(localSearch.toLowerCase()));
      }

      // Filter by confederation
      if (viewMode === 'leagues') {
        let leagues = filtered as League[];
        if (confederationFilter !== 'All') {
          leagues = leagues.filter(l => l.confederation === confederationFilter || l.id === 'others');
        }
        if (onlyPopular) {
          leagues = leagues.filter(l => l.isPopular === true);
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

  const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active 
        ? 'bg-emerald-600/20 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
      }`}
    >
      <span className={active ? 'text-emerald-400' : 'text-gray-500'}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );

  const EntityItem: React.FC<{ entity: SelectableEntity }> = ({ entity }) => {
    const isActive = selectedEntity?.id === entity.id;
    
    // Determine icon based on type
    const renderIcon = () => {
      if (entity.type === 'league') return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
      );
      if (entity.type === 'nation') return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
      );
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
      );
    };

    return (
      <button
        onClick={() => onSelectEntity(entity)}
        className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
          isActive 
          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' 
          : 'bg-gray-900/40 border-white/5 text-gray-400 hover:border-emerald-500/30 hover:text-emerald-400'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-400'}>
            {renderIcon()}
          </span>
          <span className="truncate">{entity.name}</span>
        </div>
        {isActive && (
          <svg className="w-3.5 h-3.5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
        )}
      </button>
    );
  };

  const confederations: (Confederation | 'All')[] = ['All', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'];

  return (
    <aside className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-full overflow-hidden">
      {/* User Section */}
      <div className="p-5 border-b border-gray-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-emerald-500/20">
            GF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-100">Football Fan</span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Premium Access</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar flex flex-col">
        {/* Navigation Categories */}
        <section>
          <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-600">{t('categories')}</h3>
          <div className="space-y-1">
            <NavItem 
              label={t('leagues')} 
              active={viewMode === 'leagues'} 
              onClick={() => handleViewChange('leagues')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
            />
            <NavItem 
              label={t('nations')} 
              active={viewMode === 'nations'} 
              onClick={() => handleViewChange('nations')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>} 
            />
            <NavItem 
              label={t('match_center')} 
              active={viewMode === 'realtime'} 
              onClick={() => handleViewChange('realtime')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            />
          </div>
        </section>

        {/* Filters and Selection Area */}
        <div className="space-y-4 flex flex-col flex-1 min-h-0">
          {(viewMode === 'leagues' || viewMode === 'nations') && (
            <section className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] uppercase tracking-wider font-bold text-gray-500">{t('filters')}</h3>
                {viewMode === 'leagues' && (
                  <button 
                    onClick={() => setOnlyPopular(!onlyPopular)}
                    className={`flex items-center gap-1 transition-colors ${onlyPopular ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                  >
                    <svg className="w-3.5 h-3.5" fill={onlyPopular ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-[9px] font-bold">{t('top')}</span>
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1">
                {confederations.map(conf => (
                  <button
                    key={conf}
                    onClick={() => setConfederationFilter(conf)}
                    className={`
                      px-2 py-0.5 rounded text-[8px] font-bold tracking-tight transition-all uppercase
                      ${confederationFilter === conf 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
                        : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      }
                    `}
                  >
                    {conf === 'All' ? t('all') : conf}
                  </button>
                ))}
              </div>

              {/* Local Search inside Filter area */}
              <div className="relative">
                <input 
                  type="text" 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={`Filter ${viewMode}...`}
                  className="w-full bg-black/40 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[10px] text-gray-300 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
                <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </section>
          )}

          {/* Dynamic List Section */}
          <section className="flex-1 min-h-0 flex flex-col">
            <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-600">
              {localSearch ? 'Results' : viewMode === 'realtime' ? 'Schedule' : 'Browse'}
            </h3>
            <div className="space-y-1.5 overflow-y-auto pr-1 custom-scrollbar pb-4">
              {filteredEntities.length > 0 ? (
                filteredEntities.map(entity => (
                  <EntityItem key={entity.id} entity={entity} />
                ))
              ) : (
                <div className="px-3 py-6 text-center bg-gray-900/20 rounded-xl border border-dashed border-gray-800">
                  <p className="text-[10px] text-gray-600 italic">No matches found for your criteria.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="p-4 bg-gray-950 border-t border-gray-900">
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800 group hover:border-emerald-500/20 transition-colors">
          <p className="text-[9px] text-gray-600 text-center uppercase tracking-[0.2em] font-bold group-hover:text-emerald-500 transition-colors">
            Powered by Gemini 2.5
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
