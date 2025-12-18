
import React from 'react';
import { SelectableEntity, ViewMode } from '../types';
import { LEAGUES, NATIONS, REALTIME_CATEGORIES } from '../constants';

interface SidebarProps {
  selectedEntity: SelectableEntity | null;
  onSelectEntity: (entity: SelectableEntity) => void;
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedEntity, onSelectEntity, viewMode, onViewChange }) => {

  const handleViewChange = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onViewChange(mode);
    }
  };
  
  const getEntities = () => {
      switch(viewMode) {
          case 'leagues': return LEAGUES;
          case 'nations': return NATIONS;
          case 'realtime': return REALTIME_CATEGORIES;
          default: return [];
      }
  };
  
  const entities = getEntities();

  const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
        ? 'bg-emerald-600/20 text-emerald-400 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)]' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
      }`}
    >
      <span className={active ? 'text-emerald-400' : 'text-gray-500'}>{icon}</span>
      {label}
    </button>
  );

  return (
    <aside className="w-72 bg-gray-950 border-r border-gray-800 flex flex-col h-full overflow-hidden">
      {/* User Profile Section */}
      <div className="p-5 border-b border-gray-900">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-100">John Doe</span>
            <span className="text-xs text-gray-500">Pro Enthusiast</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Main Menu */}
        <section>
          <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-600">Menu</h3>
          <div className="space-y-1">
            <NavItem 
              label="Dashboard" 
              active={viewMode !== 'realtime' && !selectedEntity} 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
            />
            <NavItem 
              label="Favorites" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} 
            />
            <NavItem 
              label="Settings" 
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} 
            />
          </div>
        </section>

        {/* Categories */}
        <section>
          <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-600">Categories</h3>
          <div className="space-y-1">
            <NavItem 
              label="Leagues" 
              active={viewMode === 'leagues'} 
              onClick={() => handleViewChange('leagues')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
            />
            <NavItem 
              label="Nations" 
              active={viewMode === 'nations'} 
              onClick={() => handleViewChange('nations')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>} 
            />
            <NavItem 
              label="Match Center" 
              active={viewMode === 'realtime'} 
              onClick={() => handleViewChange('realtime')}
              icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
            />
          </div>
        </section>

        {/* Dynamic Browsing List */}
        <section>
          <h3 className="px-3 mb-2 text-[10px] uppercase tracking-wider font-bold text-gray-600">
            Browse {viewMode === 'realtime' ? 'Timelines' : viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </h3>
          <div className="space-y-0.5">
            {entities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => onSelectEntity(entity)}
                className={`
                  w-full flex items-center text-left px-3 py-2 rounded-md text-sm transition-all duration-150 group
                  ${selectedEntity?.id === entity.id 
                    ? 'text-white bg-emerald-600 shadow-lg shadow-emerald-900/20' 
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800/50'
                  }
                `}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 transition-all ${
                  selectedEntity?.id === entity.id ? 'bg-white scale-110' : 'bg-gray-700 group-hover:bg-emerald-500'
                }`}></span>
                <span className="truncate">{entity.name}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gray-950 border-t border-gray-900">
        <div className="bg-gray-900/50 rounded-xl p-3 border border-gray-800">
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold">Powered by Gemini 2.5</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
