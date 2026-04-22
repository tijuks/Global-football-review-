import React, { useState, useMemo } from 'react';
import { PlayerStat } from '../types';

interface SortableStatTableProps {
  title: string;
  data: PlayerStat[];
  icon: string;
  metric: keyof PlayerStat;
}

export const SortableStatTable: React.FC<SortableStatTableProps> = ({ title, data, icon, metric }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerStat | 'name'; direction: 'asc' | 'desc' } | null>(null);

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key as keyof PlayerStat];
        let bVal = b[sortConfig.key as keyof PlayerStat];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof PlayerStat | 'name') => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof PlayerStat | 'name') => {
    if (!sortConfig || sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="bg-gray-800/50 rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-4 bg-gray-700/30 border-b border-white/5 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h4 className="text-sm font-black uppercase tracking-widest text-pitch-green-light">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-gray-500 border-b border-white/5">
              <th className="p-3 font-black uppercase tracking-tighter cursor-pointer" onClick={() => requestSort('name')}>Player {getSortIcon('name')}</th>
              <th className="p-3 font-black uppercase tracking-tighter cursor-pointer" onClick={() => requestSort('team')}>Team {getSortIcon('team')}</th>
              <th className="p-3 font-black uppercase tracking-tighter text-right cursor-pointer" onClick={() => requestSort(metric)}>{String(metric)} {getSortIcon(metric)}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedData.map((player, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="p-3 font-bold text-white">{player.name}</td>
                <td className="p-3 text-gray-400">{player.team}</td>
                <td className="p-3 text-right font-black text-pitch-green">{player[metric]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
