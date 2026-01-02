
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as geminiService from '../services/geminiService';

interface PlayerSearchProps {
  onSearch: (name: string) => void;
}

const RECENT_PLAYERS_KEY = 'recent_football_players';

const PlayerSearch: React.FC<PlayerSearchProps> = ({ onSearch }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentPlayers, setRecentPlayers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_PLAYERS_KEY);
    if (saved) {
      setRecentPlayers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToRecent = (name: string) => {
    const updated = [name, ...recentPlayers.filter(p => p !== name)].slice(0, 5);
    setRecentPlayers(updated);
    localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(updated));
  };

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const results = await geminiService.fetchPlayerSuggestions(q);
      setSuggestions(results);
    } catch (err) {
      console.error("Autocomplete failed", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    
    if (query.trim()) {
      debounceTimer.current = window.setTimeout(() => {
        fetchSuggestions(query);
      }, 400);
    } else {
      setSuggestions([]);
    }
  }, [query, fetchSuggestions]);

  const handleSelect = (name: string) => {
    onSearch(name);
    addToRecent(name);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSelect(query.trim());
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <form onSubmit={handleSubmit} className="relative z-30">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className={`h-3.5 w-3.5 transition-colors ${isLoading ? 'text-emerald-500 animate-pulse' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder={t('search_placeholder')}
          className="block w-full pl-10 pr-3 py-1.5 bg-black/20 border border-white/10 rounded-full text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-black/40 transition-all shadow-inner"
        />
      </form>

      {showSuggestions && (query.trim() || recentPlayers.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-20 animate-fade-in backdrop-blur-xl bg-opacity-95">
          {query.trim() && suggestions.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-500">{t('suggestions')}</p>
              {suggestions.map((name, idx) => (
                <button
                  key={`sug-${idx}`}
                  onClick={() => handleSelect(name)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-emerald-600/20 hover:text-emerald-400 rounded-lg transition-colors flex items-center gap-2 group"
                >
                  <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {name}
                </button>
              ))}
            </div>
          )}
          
          {recentPlayers.length > 0 && (!query.trim() || suggestions.length === 0) && (
            <div className="p-2 border-t border-white/5">
              <p className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold text-gray-500">{t('recently_viewed')}</p>
              {recentPlayers.map((name, idx) => (
                <button
                  key={`rec-${idx}`}
                  onClick={() => handleSelect(name)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {name}
                </button>
              ))}
            </div>
          )}

          {query.trim() && !isLoading && suggestions.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500 italic">{t('press_enter')} "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
