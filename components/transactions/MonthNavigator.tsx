
import React from 'react';
import { ICONS } from '../../constants';

interface MonthNavigatorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentDate, onDateChange }) => {
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    onDateChange(newDate);
  };

  const formattedDate = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm mb-4">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
        {ICONS.chevronLeft}
      </button>
      <h3 className="text-lg font-semibold text-gray-800">{formattedDate}</h3>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
        {ICONS.chevronRight}
      </button>
    </div>
  );
};

export default MonthNavigator;
   