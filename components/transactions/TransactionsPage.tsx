import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import TransactionItem from './TransactionItem';
import TransactionForm from './TransactionForm';
import MonthNavigator from './MonthNavigator';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { ICONS } from '../../constants';
import { exportToCSV, exportSummaryToCSV } from '../../services/exportService';
import { TransactionType } from '../../types';

const TransactionsPage: React.FC = () => {
  const { state } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getFullYear() === currentDate.getFullYear() && txDate.getMonth() === currentDate.getMonth();
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.transactions, currentDate]);

  const monthlySummary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(tx => tx.type === TransactionType.INCOME)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = filteredTransactions
      .filter(tx => tx.type === TransactionType.EXPENSE)
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
  }, [filteredTransactions]);


  const handleExportDetails = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export for the selected month.');
      return;
    }
    exportToCSV(filteredTransactions, state, 'transactions.csv');
  };

  const handleExportSummary = () => {
    if (filteredTransactions.length === 0) {
      alert('No data to export for the selected month.');
      return;
    }
    const monthString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    const summaryData = {
        ...monthlySummary,
        month: monthString
    };
    exportSummaryToCSV(summaryData, `financial-summary-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex gap-2">
            <Button onClick={handleExportSummary} variant="secondary" title="Export Monthly Summary">
                {ICONS.trendingUp}
            </Button>
            <Button onClick={handleExportDetails} variant="secondary" title="Export Transaction Details">
                {ICONS.download}
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
                {ICONS.plus}
                <span>Add New</span>
            </Button>
        </div>
      </div>

      <MonthNavigator currentDate={currentDate} onDateChange={setCurrentDate} />

      <Card>
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No transactions for this month.</p>
            <p className="text-sm text-gray-400 mt-2">Click 'Add New' to get started.</p>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Transaction">
        <TransactionForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
