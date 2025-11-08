
import React from 'react';
import { Invoice, Bill, InvoiceStatus } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { CURRENCY, ICONS } from '../../constants';

interface InvoiceBillItemProps {
    item: Invoice | Bill;
    type: 'invoice' | 'bill';
}

const InvoiceBillItem: React.FC<InvoiceBillItemProps> = ({ item, type }) => {
    const { state, dispatch } = useAppContext();
    const contact = state.contacts.find(c => c.id === item.contactId);
    
    const getStatusChipClass = (status: InvoiceStatus) => {
        switch (status) {
            case InvoiceStatus.PAID:
                return 'bg-green-100 text-green-800';
            case InvoiceStatus.UNPAID:
                return 'bg-yellow-100 text-yellow-800';
            case InvoiceStatus.OVERDUE:
                return 'bg-red-100 text-red-800';
            case InvoiceStatus.DRAFT:
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'invoice') {
                dispatch({ type: 'DELETE_INVOICE', payload: item.id });
            } else {
                dispatch({ type: 'DELETE_BILL', payload: item.id });
            }
        }
    };

    const itemNumber = 'invoiceNumber' in item ? item.invoiceNumber : item.billNumber;

    return (
        <div className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-grow">
                <div className="flex items-center gap-3">
                    <p className="font-bold text-primary">#{itemNumber}</p>
                    <p className="font-semibold">{contact?.name || 'Unknown Contact'}</p>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                    <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
                 <div className="text-right">
                    <p className="font-bold text-lg">{CURRENCY} {item.amount.toLocaleString()}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusChipClass(item.status)}`}>
                        {item.status}
                    </span>
                </div>
                <button onClick={handleDelete} className="text-gray-400 hover:text-danger p-1">
                    {ICONS.trash}
                </button>
            </div>
        </div>
    );
};

export default InvoiceBillItem;
