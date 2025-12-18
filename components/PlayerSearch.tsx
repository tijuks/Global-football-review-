import React, { useState } from 'react';

interface PlayerSearchProps {
  onSearch: (name: string) => void;
}

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search player..."
        className="block w-full pl-10 pr-3 py-1.5 bg-black/20 border border-white/10 rounded-full text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-black/40 transition-all shadow-inner"
      />
    </form>
  );
};

export default PlayerSearch;