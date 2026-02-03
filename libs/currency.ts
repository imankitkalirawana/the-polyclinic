import Currency from 'currency.js';
import { CLINIC_INFO } from './config';

interface FormatCurrencyOptions {
  symbol?: string;
  precision?: number;
  separator?: string;
  decimal?: string;
}

export const currency = (amount: number, options: FormatCurrencyOptions = {}): string => {
  return new Currency(amount, {
    symbol: options.symbol ?? CLINIC_INFO.preferences.currency.symbol,
    precision: options.precision ?? 0,
    separator: options.separator ?? ',',
    decimal: options.decimal ?? '.',
  }).format();
};
