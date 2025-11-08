
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ICONS } from '../../constants';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import InvoiceBillForm from './InvoiceBillForm';
import InvoiceBillList from './InvoiceBillList';

const InvoicesPage: React.FC = () => {
    const { state } = useAppContext();
    const [activeTab, setActiveTab] = useState<'Invoices' | 'Bills'>('Invoices');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Invoices & Bills</h2>
                <Button onClick={openModal}>
                    {ICONS.plus}
                    <span>Create New</span>
                </Button>
            </div>

            <Card>
                <Tabs
                    tabs={['Invoices', 'Bills']}
                    activeTab={activeTab}
                    onTabClick={(tab) => setActiveTab(tab as 'Invoices' | 'Bills')}
                />
                <div className="mt-4">
                    {activeTab === 'Invoices' && <InvoiceBillList items={state.invoices} type="invoice" />}
                    {activeTab === 'Bills' && <InvoiceBillList items={state.bills} type="bill" />}
                </div>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={closeModal} title={`Create New ${activeTab === 'Invoices' ? 'Invoice' : 'Bill'}`}>
                <InvoiceBillForm 
                    onClose={closeModal}
                    type={activeTab === 'Invoices' ? 'invoice' : 'bill'}
                />
            </Modal>
        </div>
    );
};

export default InvoicesPage;
