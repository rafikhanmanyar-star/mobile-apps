
import React from 'react';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabClick: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick }) => {
  const getTabColor = (tab: string) => {
    switch(tab) {
        case 'Income': return 'border-success text-success';
        case 'Expense': return 'border-danger text-danger';
        case 'Transfer': return 'border-accent text-accent';
        case 'Loan': return 'border-warning text-warning';
        default: return 'border-primary text-primary';
    }
  }

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-4" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${ activeTab === tab
                ? `${getTabColor(tab)}`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
   