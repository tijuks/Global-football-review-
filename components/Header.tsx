import React from 'react';
import { APP_TITLE } from '../constants';
import InstallButton from './InstallButton';
import PlayerSearch from './PlayerSearch';

interface HeaderProps {
  onSearchPlayer: (name: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchPlayer }) => {
  return (
    <header className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-700 text-white p-4 shadow-lg relative z-20">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-4">
             <h1 className="text-xl sm:text-2xl font-bold tracking-tight shrink-0">{APP_TITLE}</h1>
             <div className="hidden md:block">
                <PlayerSearch onSearch={onSearchPlayer} />
             </div>
          </div>
          
          <div className="flex md:hidden w-full">
            <PlayerSearch onSearch={onSearchPlayer} />
          </div>

          <div className="flex-1 flex justify-end gap-3">
             <InstallButton />
          </div>
       </div>
    </header>
  );
};

export default Header;