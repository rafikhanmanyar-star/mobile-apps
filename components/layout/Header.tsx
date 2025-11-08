
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Finance Tracker Pro
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
   