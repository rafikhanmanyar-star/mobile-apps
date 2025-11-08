
import React from 'react';
import { Invoice, Bill } from '../../types';
import InvoiceBillItem from './InvoiceBillItem';

interface InvoiceBillListProps {
    items: (Invoice | Bill)[];
    type: 'invoice' | 'bill';
}

const InvoiceBillList: React.FC<InvoiceBillListProps> = ({ items, type }) => {
    const sortedItems = [...items].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    if (items.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No {type === 'invoice' ? 'invoices' : 'bills'} yet.</p>
                <p className="text-sm text-gray-400 mt-2">Click 'Create New' to get started.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-2">
            {sortedItems.map(item => (
                <InvoiceBillItem key={item.id} item={item} type={type} />
            ))}
        </div>
    );
};

export default InvoiceBillList;
