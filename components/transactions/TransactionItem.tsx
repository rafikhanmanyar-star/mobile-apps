
import React from 'react';
import { Transaction, TransactionType, LoanSubtype } from '../../types';
import { CURRENCY, ICONS } from '../../constants';
import { useAppContext } from '../../context/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { state, dispatch } = useAppContext();
  const { type, amount, description, date, accountId, fromAccountId, toAccountId } = transaction;

  const getAccountName = (id: string | undefined) => state.accounts.find(a => a.id === id)?.name || 'N/A';
  
  const handleDelete = () => {
    if(window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: transaction.id });
    }
  };

  const getTransactionDetails = () => {
    const iconColorClass = 
        type === TransactionType.INCOME || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.RECEIVE) ? "text-success" :
        type === TransactionType.EXPENSE || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.REPAY) ? "text-danger" :
        "text-accent";
    
    const icon = 
        type === TransactionType.INCOME || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.RECEIVE) ? ICONS.arrowDown :
        type === TransactionType.EXPENSE || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.REPAY) ? ICONS.arrowUp :
        ICONS.arrowRight;
    
    const amountPrefix = 
        type === TransactionType.INCOME || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.RECEIVE) ? "+" :
        type === TransactionType.EXPENSE || (type === TransactionType.LOAN && transaction.subtype === LoanSubtype.REPAY) ? "-" : "";

    const accountInfo = type === TransactionType.TRANSFER 
        ? `${getAccountName(fromAccountId)} → ${getAccountName(toAccountId)}`
        : getAccountName(accountId);

    const title = type === TransactionType.LOAN ? `${transaction.subtype}: ${description}` : description;

    return { icon, iconColorClass, amountPrefix, accountInfo, title };
  };

  const { icon, iconColorClass, amountPrefix, accountInfo, title } = getTransactionDetails();

  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
      <div className={`mr-4 p-2 rounded-full bg-gray-100 ${iconColorClass}`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{accountInfo}</p>
        <p className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center">
        <p className={`font-bold text-right mr-4 ${iconColorClass}`}>
          {amountPrefix}{CURRENCY} {amount.toLocaleString()}
        </p>
        <button onClick={handleDelete} className="text-gray-400 hover:text-danger p-1">
          {ICONS.trash}
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
   