
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Transaction, TransactionType, IncomeSubtype, LoanSubtype, InvoiceStatus } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { ICONS } from '../../constants';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState<TransactionType>(TransactionType.INCOME);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState('');
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [contactId, setContactId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [incomeSubtype, setIncomeSubtype] = useState<IncomeSubtype>(IncomeSubtype.INSTALLMENT);
  const [loanSubtype, setLoanSubtype] = useState<LoanSubtype>(LoanSubtype.RECEIVE);
  const [invoiceId, setInvoiceId] = useState('');
  const [billId, setBillId] = useState('');

  useEffect(() => {
    if (state.accounts.length > 0) {
      setAccountId(state.accounts[0].id);
      setFromAccountId(state.accounts[0].id);
      if (state.accounts.length > 1) {
        setToAccountId(state.accounts[1].id);
      } else {
        setToAccountId(state.accounts[0].id);
      }
    }
  }, [state.accounts]);

  useEffect(() => {
    if (invoiceId) {
        const selectedInvoice = state.invoices.find(inv => inv.id === invoiceId);
        if (selectedInvoice) {
            setAmount(selectedInvoice.amount.toString());
            setDescription(`Payment for Invoice #${selectedInvoice.invoiceNumber}`);
            setContactId(selectedInvoice.contactId);
            setProjectId(selectedInvoice.projectId || '');
        }
    }
  }, [invoiceId, state.invoices]);

  useEffect(() => {
    if (billId) {
        const selectedBill = state.bills.find(b => b.id === billId);
        if (selectedBill) {
            setAmount(selectedBill.amount.toString());
            setDescription(`Payment for Bill #${selectedBill.billNumber}`);
            setContactId(selectedBill.contactId);
            setProjectId(selectedBill.projectId || '');
        }
    }
  }, [billId, state.bills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) {
        alert("Please enter a valid amount.");
        return;
    }

    if (activeTab === TransactionType.TRANSFER && fromAccountId === toAccountId) {
        alert("From and To accounts cannot be the same for a transfer.");
        return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: activeTab,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      description,
      accountId: activeTab === TransactionType.TRANSFER ? '' : accountId,
      fromAccountId: activeTab === TransactionType.TRANSFER ? fromAccountId : undefined,
      toAccountId: activeTab === TransactionType.TRANSFER ? toAccountId : undefined,
      subtype: activeTab === TransactionType.INCOME ? incomeSubtype : activeTab === TransactionType.LOAN ? loanSubtype : undefined,
      contactId: contactId || undefined,
      projectId: projectId || undefined,
      categoryId: categoryId || undefined,
      invoiceId: invoiceId || undefined,
      billId: billId || undefined,
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    onClose();
  };
  
  const unpaidInvoices = state.invoices.filter(i => i.status !== InvoiceStatus.PAID);
  const unpaidBills = state.bills.filter(b => b.status !== InvoiceStatus.PAID);

  const renderFormFields = () => {
    switch (activeTab) {
      case TransactionType.INCOME:
        return (
          <>
            <Select label="Pay against Invoice (Optional)" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)}>
                <option value="">Select an Invoice</option>
                {unpaidInvoices.map(inv => <option key={inv.id} value={inv.id}>#{inv.invoiceNumber} - {state.contacts.find(c=>c.id === inv.contactId)?.name} - {inv.amount}</option>)}
            </Select>
            <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)} disabled={!!invoiceId}>
                {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </Select>
            <Select label="Income Type" value={incomeSubtype} onChange={(e) => setIncomeSubtype(e.target.value as IncomeSubtype)}>
                <option value={IncomeSubtype.INSTALLMENT}>Installment</option>
                <option value={IncomeSubtype.RENT}>Rent</option>
            </Select>
             <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select Category</option>
                {state.categories.filter(c => c.type === TransactionType.INCOME).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
             <Select label="Tenant/Client" value={contactId} onChange={(e) => setContactId(e.target.value)} disabled={!!invoiceId}>
                <option value="">Select Contact</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </>
        );
      case TransactionType.EXPENSE:
        return (
          <>
            <Select label="Pay against Bill (Optional)" value={billId} onChange={(e) => setBillId(e.target.value)}>
                <option value="">Select a Bill</option>
                {unpaidBills.map(b => <option key={b.id} value={b.id}>#{b.billNumber} - {state.contacts.find(c=>c.id === b.contactId)?.name} - {b.amount}</option>)}
            </Select>
            <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)} disabled={!!billId}>
                {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </Select>
            <Select label="Category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select Category</option>
                {state.categories.filter(c => c.type === TransactionType.EXPENSE).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </Select>
            <Select label="Vendor/Supplier" value={contactId} onChange={(e) => setContactId(e.target.value)} disabled={!!billId}>
                <option value="">Select Contact</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </>
        );
      case TransactionType.TRANSFER:
        return (
          <>
            <Select label="From Account" value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)}>
                {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </Select>
            <Select label="To Account" value={toAccountId} onChange={(e) => setToAccountId(e.target.value)}>
                {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </Select>
          </>
        );
      case TransactionType.LOAN:
        return (
          <>
            <Select label="Loan Action" value={loanSubtype} onChange={(e) => setLoanSubtype(e.target.value as LoanSubtype)}>
                <option value={LoanSubtype.RECEIVE}>Receive Loan</option>
                <option value={LoanSubtype.REPAY}>Repay Loan</option>
            </Select>
            <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                {state.accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </Select>
            <Select label="Person/Entity" value={contactId} onChange={(e) => setContactId(e.target.value)}>
                <option value="">Select Contact</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {(Object.values(TransactionType)).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required disabled={!!invoiceId || !!billId} />
      <Input label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Monthly rent" required />
      <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      
      {renderFormFields()}
      
      <Select label="Project (Optional)" value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={!!invoiceId || !!billId}>
        <option value="">Select Project</option>
        {state.projects.map(proj => <option key={proj.id} value={proj.id}>{proj.name}</option>)}
      </Select>

      <div className="pt-4 flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">
          {ICONS.plus}
          <span>Add Transaction</span>
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
