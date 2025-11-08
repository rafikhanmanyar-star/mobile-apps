
import React, { useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TransactionType } from '../../types';
import Card from '../ui/Card';
import { CURRENCY } from '../../constants';

const DashboardPage: React.FC = () => {
  const { state } = useAppContext();

  const totalBalance = useMemo(() => {
    return state.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }, [state.accounts]);

  const projectData = useMemo(() => {
    const data: { name: string; income: number; expense: number }[] = [];
    state.projects.forEach(project => {
      const projectTransactions = state.transactions.filter(tx => tx.projectId === project.id);
      const income = projectTransactions
        .filter(tx => tx.type === TransactionType.INCOME)
        .reduce((sum, tx) => sum + tx.amount, 0);
      const expense = projectTransactions
        .filter(tx => tx.type === TransactionType.EXPENSE)
        .reduce((sum, tx) => sum + tx.amount, 0);
      data.push({ name: project.name, income, expense });
    });
    return data;
  }, [state.projects, state.transactions]);
  
  const incomeExpenseData = useMemo(() => {
    const dataByMonth: { [key: string]: { name: string; income: number; expense: number } } = {};
    state.transactions.forEach(tx => {
        const month = new Date(tx.date).toLocaleString('default', { month: 'short', year: '2-digit'});
        if (!dataByMonth[month]) {
            dataByMonth[month] = { name: month, income: 0, expense: 0 };
        }
        if (tx.type === TransactionType.INCOME) {
            dataByMonth[month].income += tx.amount;
        } else if (tx.type === TransactionType.EXPENSE) {
            dataByMonth[month].expense += tx.amount;
        }
    });
    return Object.values(dataByMonth).reverse();
  }, [state.transactions]);


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <Card>
        <h3 className="text-lg font-semibold mb-1">Total Balance</h3>
        <p className="text-3xl font-bold text-primary">{CURRENCY} {totalBalance.toLocaleString()}</p>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.accounts.map(account => (
              <Card key={account.id}>
                  <h3 className="text-lg font-semibold">{account.name}</h3>
                  <p className="text-2xl font-bold text-secondary">{CURRENCY} {account.balance.toLocaleString()}</p>
              </Card>
          ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expense</h3>
        {incomeExpenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${CURRENCY} ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" />
              <Bar dataKey="expense" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No transaction data available.</p>
        )}
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Project Summary</h3>
        {projectData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${CURRENCY} ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" fill="#16a34a" />
              <Bar dataKey="expense" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 py-8">No projects with transactions to display.</p>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
   