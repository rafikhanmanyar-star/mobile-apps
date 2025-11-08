
import React from 'react';
import { Page } from '../../types';
import { ICONS } from '../../constants';

interface FooterProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, setCurrentPage }) => {
  // Fix: Replaced JSX.Element with React.ReactElement to resolve namespace error.
  const navItems: { page: Page; label: string; icon: React.ReactElement }[] = [
    { page: 'transactions', label: 'Transactions', icon: ICONS.home },
    { page: 'invoices', label: 'Invoices', icon: ICONS.fileText },
    { page: 'dashboard', label: 'Dashboard', icon: ICONS.trendingUp },
    { page: 'settings', label: 'Settings', icon: ICONS.settings },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg border-t border-gray-200">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
              currentPage === item.page
                ? 'text-primary'
                : 'text-gray-500 hover:text-secondary'
            }`}
          >
            {item.icon}
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

export default Footer;
