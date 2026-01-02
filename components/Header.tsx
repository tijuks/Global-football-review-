
import React from 'react';
import { useTranslation } from 'react-i18next';
import PlayerSearch from './PlayerSearch';

interface HeaderProps {
  onSearchPlayer: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchPlayer }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLng = i18n.language.split('-')[0];

  return (
    <header className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 text-white p-4 shadow-lg relative z-20">
       <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo/Title */}
          <div className="flex items-center gap-4 shrink-0">
             <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
               {t('app_title')}
             </h1>
          </div>
          
          {/* Unified Search */}
          <div className="w-full max-w-md order-3 sm:order-2">
            <PlayerSearch onSearch={onSearchPlayer} />
          </div>

          {/* Actions & Language Switcher */}
          <div className="flex items-center gap-3 shrink-0 order-2 sm:order-3">
             <div className="flex bg-black/20 rounded-full p-0.5 border border-white/10 overflow-hidden">
                {['en', 'es', 'fr'].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      currentLng === lng 
                      ? 'bg-white text-emerald-700 shadow-sm' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lng}
                  </button>
                ))}
             </div>
          </div>
       </div>
    </header>
  );
};

export default Header;
