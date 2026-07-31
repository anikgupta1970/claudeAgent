export function buildTenureISO(years: number | '', months: number | '', days: number | ''): string {
  const y = Number(years) || 0;
  const m = Number(months) || 0;
  const d = Number(days) || 0;
  let iso = 'P';
  if (y) iso += `${y}Y`;
  if (m) iso += `${m}M`;
  if (d) iso += `${d}D`;
  return iso === 'P' ? 'P0D' : iso;
}

export function addTenureToDate(base: Date, years: number | '', months: number | '', days: number | ''): Date {
  const result = new Date(base);
  result.setFullYear(result.getFullYear() + (Number(years) || 0));
  result.setMonth(result.getMonth() + (Number(months) || 0));
  result.setDate(result.getDate() + (Number(days) || 0));
  return result;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatCurrency(amount: string | number): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function maskAccountNo(accountNo: string): string {
  if (!accountNo || accountNo.length < 4) return accountNo;
  return 'XXXX' + accountNo.slice(-4);
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function interestOptionLabel(opt: string): string {
  const map: Record<string, string> = {
    at_maturity: 'At Maturity',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
  };
  return map[opt] ?? opt;
}

export function maturityOptionLabel(opt: string): string {
  const map: Record<string, string> = {
    close: 'Do Not Renew',
    renew: 'Renew',
    transfer: 'Transfer',
  };
  return map[opt] ?? opt;
}
