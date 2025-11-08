import { Transaction, AppState } from '../types';

function convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
        return '';
    }
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

function triggerDownload(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export function exportToCSV(transactions: Transaction[], state: AppState, filename: string) {
    const dataToExport = transactions.map(tx => {
        const getAccountName = (id: string | undefined) => state.accounts.find(a => a.id === id)?.name || '';
        const getContactName = (id: string | undefined) => state.contacts.find(c => c.id === id)?.name || '';
        const getProjectName = (id: string | undefined) => state.projects.find(p => p.id === id)?.name || '';
        const getCategoryName = (id: string | undefined) => state.categories.find(c => c.id === id)?.name || '';

        return {
            Date: new Date(tx.date).toLocaleDateString(),
            Type: tx.type,
            Subtype: tx.subtype || '',
            Description: tx.description,
            Amount: tx.amount,
            Account: getAccountName(tx.accountId),
            'From Account': getAccountName(tx.fromAccountId),
            'To Account': getAccountName(tx.toAccountId),
            Contact: getContactName(tx.contactId),
            Project: getProjectName(tx.projectId),
            Category: getCategoryName(tx.categoryId),
        };
    });

    const csvContent = convertToCSV(dataToExport);
    triggerDownload(csvContent, filename);
}

export function exportSummaryToCSV(summary: { totalIncome: number; totalExpense: number; netBalance: number; month: string }, filename: string) {
    const dataToExport = [
        { Item: 'Month', Value: summary.month },
        { Item: 'Total Income', Value: summary.totalIncome },
        { Item: 'Total Expense', Value: summary.totalExpense },
        { Item: 'Net Balance', Value: summary.netBalance },
    ];
    const csvContent = convertToCSV(dataToExport);
    triggerDownload(csvContent, filename);
}
