import { format } from 'date-fns';

export const formatTime = (date: Date) => format(date, 'p');

export const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');
