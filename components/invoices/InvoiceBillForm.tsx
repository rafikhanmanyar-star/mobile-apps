
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Invoice, Bill, InvoiceStatus } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface InvoiceBillFormProps {
  onClose: () => void;
  type: 'invoice' | 'bill';
}

const InvoiceBillForm: React.FC<InvoiceBillFormProps> = ({ onClose, type }) => {
    const { state, dispatch } = useAppContext();
    const [contactId, setContactId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [amount, setAmount] = useState('');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [number, setNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactId || !amount || !number) {
            alert('Please fill all required fields.');
            return;
        }

        const commonData = {
            id: Date.now().toString(),
            contactId,
            projectId: projectId || undefined,
            amount: parseFloat(amount),
            issueDate: new Date(issueDate).toISOString(),
            dueDate: new Date(dueDate).toISOString(),
            status: InvoiceStatus.UNPAID,
            description,
        };

        if (type === 'invoice') {
            const newInvoice: Invoice = {
                ...commonData,
                invoiceNumber: number,
            };
            dispatch({ type: 'ADD_INVOICE', payload: newInvoice });
        } else {
            const newBill: Bill = {
                ...commonData,
                billNumber: number,
            };
            dispatch({ type: 'ADD_BILL', payload: newBill });
        }
        
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
                label={`${type === 'invoice' ? 'Invoice' : 'Bill'} Number`}
                type="text" 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={type === 'invoice' ? 'e.g., INV-001' : 'e.g., BILL-001'}
                required 
            />
            <Select label="Contact" value={contactId} onChange={(e) => setContactId(e.target.value)} required>
                <option value="">Select Contact</option>
                {state.contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
            </Select>
            <Input label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
            <Input label="Description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={`Details about this ${type}`} required />
            <Input label="Issue Date" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            <Select label="Project (Optional)" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                <option value="">Select Project</option>
                {state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <div className="pt-4 flex justify-end space-x-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit">Create {type === 'invoice' ? 'Invoice' : 'Bill'}</Button>
            </div>
        </form>
    );
};

export default InvoiceBillForm;
