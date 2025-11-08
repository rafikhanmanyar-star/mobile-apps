
import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { Account, Contact, Project, Category, ContactType, TransactionType } from '../../types';
import { ICONS } from '../../constants';
import Button from '../ui/Button';

// Generic Manager Component
interface ManagerProps<T extends { id: string; name: string }> {
  title: string;
  items: T[];
  onAdd: (item: Omit<T, 'id'>) => void;
  onDelete: (id: string) => void;
  renderForm: (onSubmit: (item: Omit<T, 'id'>) => void) => React.ReactNode;
}

const Manager = <T extends { id: string; name: string }>({ title, items, onAdd, onDelete, renderForm }: ManagerProps<T>) => {
  const [showForm, setShowForm] = React.useState(false);

  const handleSubmit = (item: Omit<T, 'id'>) => {
    onAdd(item);
    setShowForm(false);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New'}
        </Button>
      </div>
      {showForm && <div className="mb-4">{renderForm(handleSubmit)}</div>}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <span>{item.name}</span>
            <button onClick={() => onDelete(item.id)} className="text-gray-400 hover:text-danger p-1">
              {ICONS.trash}
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500">No items yet.</p>}
      </ul>
    </Card>
  );
};

// Specific Form Components
const AccountForm: React.FC<{ onSubmit: (item: Omit<Account, 'id'>) => void }> = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, balance: parseFloat(balance) || 0 });
    setName('');
    setBalance('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Account Name" className="flex-grow border-b-2 p-1" required />
      <input value={balance} onChange={e => setBalance(e.target.value)} placeholder="Initial Balance" type="number" className="w-32 border-b-2 p-1" required />
      <Button size="sm" type="submit">Save</Button>
    </form>
  );
};

const ContactForm: React.FC<{ onSubmit: (item: Omit<Contact, 'id'>) => void }> = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<ContactType>(ContactType.TENANT);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, type });
    setName('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Contact Name" className="flex-grow border-b-2 p-1" required />
      <select value={type} onChange={e => setType(e.target.value as ContactType)} className="w-40 border-b-2 p-1 bg-white">
        {Object.values(ContactType).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <Button size="sm" type="submit">Save</Button>
    </form>
  );
};

const ProjectForm: React.FC<{ onSubmit: (item: Omit<Project, 'id'>) => void }> = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    setName('');
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Project Name" className="flex-grow border-b-2 p-1" required />
      <Button size="sm" type="submit">Save</Button>
    </form>
  );
};

const CategoryForm: React.FC<{ onSubmit: (item: Omit<Category, 'id'>) => void }> = ({ onSubmit }) => {
    const [name, setName] = React.useState('');
    const [type, setType] = React.useState<TransactionType.INCOME | TransactionType.EXPENSE>(TransactionType.EXPENSE);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, type });
        setName('');
    };
    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Category Name" className="flex-grow border-b-2 p-1" required />
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-32 border-b-2 p-1 bg-white">
                <option value={TransactionType.INCOME}>Income</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
            </select>
            <Button size="sm" type="submit">Save</Button>
        </form>
    );
};


const SettingsPage: React.FC = () => {
    const { state, dispatch } = useAppContext();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Manager<Account>
                title="Accounts"
                items={state.accounts}
                onAdd={(item) => dispatch({ type: 'ADD_ACCOUNT', payload: { ...item, id: Date.now().toString() } })}
                onDelete={(id) => dispatch({ type: 'DELETE_ACCOUNT', payload: id })}
                renderForm={(onSubmit) => <AccountForm onSubmit={onSubmit} />}
            />
            <Manager<Contact>
                title="Contacts (Owners, Tenants, Vendors)"
                items={state.contacts}
                onAdd={(item) => dispatch({ type: 'ADD_CONTACT', payload: { ...item, id: Date.now().toString() } })}
                onDelete={(id) => dispatch({ type: 'DELETE_CONTACT', payload: id })}
                renderForm={(onSubmit) => <ContactForm onSubmit={onSubmit} />}
            />
            <Manager<Project>
                title="Projects"
                items={state.projects}
                onAdd={(item) => dispatch({ type: 'ADD_PROJECT', payload: { ...item, id: Date.now().toString() } })}
                onDelete={(id) => dispatch({ type: 'DELETE_PROJECT', payload: id })}
                renderForm={(onSubmit) => <ProjectForm onSubmit={onSubmit} />}
            />
            <Manager<Category>
                title="Categories"
                items={state.categories}
                onAdd={(item) => dispatch({ type: 'ADD_CATEGORY', payload: { ...item, id: Date.now().toString() } })}
                onDelete={(id) => dispatch({ type: 'DELETE_CATEGORY', payload: id })}
                renderForm={(onSubmit) => <CategoryForm onSubmit={onSubmit} />}
            />
        </div>
    );
};

export default SettingsPage;
   