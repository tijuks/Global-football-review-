

import React, { useState, useMemo } from 'react';
import { Nation } from '../types';
import { NATIONS } from '../constants';

interface NationDatabaseProps {
  onSelectNation: (nation: Nation) => void;
}

const NationDatabase: React.FC<NationDatabaseProps> = ({ onSelectNation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'confederation'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedNations = useMemo(() => {
    return NATIONS
      .filter(nation => nation.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const valA = a[sortKey].toUpperCase();
        const valB = b[sortKey].toUpperCase();
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [searchTerm, sortKey, sortOrder]);

  const handleSort = (key: 'name' | 'confederation') => {
    if (key === sortKey) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const getSortIndicator = (key: 'name' | 'confederation') => {
    if (key !== sortKey) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-gray-800/50 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-sm animate-fade-in">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500 mb-6">
        National Teams Database
      </h2>
      
      <input
        type="text"
        placeholder="Search for a nation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 mb-6 bg-gray-900/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <button onClick={() => handleSort('name')} className="flex items-center space-x-1 focus:outline-none">
                  <span>Nation</span>
                  <span className="text-gray-400">{getSortIndicator('name')}</span>
                </button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                 <button onClick={() => handleSort('confederation')} className="flex items-center space-x-1 focus:outline-none">
                  <span>Confederation</span>
                  <span className="text-gray-400">{getSortIndicator('confederation')}</span>
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {filteredAndSortedNations.map(nation => (
              <tr 
                key={nation.id} 
                onClick={() => onSelectNation(nation)}
                className="hover:bg-green-800/40 cursor-pointer transition-colors duration-150"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onSelectNation(nation)}
                aria-label={`Select ${nation.name}`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{nation.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{nation.confederation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedNations.length === 0 && (
        <p className="text-center text-gray-400 py-8">No nations found matching your search.</p>
      )}
    </div>
  );
};

export default NationDatabase;