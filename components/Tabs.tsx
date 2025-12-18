
import React from 'react';
import { TabDefinition, TabId } from '../types';

interface TabsProps {
  tabs: TabDefinition[];
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onSelectTab }) => {
  return (
    <nav className="flex space-x-1 border-b-2 border-gray-700" aria-label="Tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelectTab(tab.id)}
          className={`
            px-4 py-3 font-medium text-sm rounded-t-lg transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-60
            ${activeTab === tab.id
              ? 'border-green-500 border-b-2 text-green-400 bg-gray-800'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border-b-2 border-transparent'
            }
          `}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default Tabs;
