/**
 * Formatting utilities for dates, currency, and numbers.
 */

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount ?? 0);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(date));

export const formatNumber = (num) =>
  new Intl.NumberFormat('en-IN').format(num ?? 0);
