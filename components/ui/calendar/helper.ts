import { format } from 'date-fns';

export const formatTime = (date: Date) => {
  return format(date, 'p');
};

export const formatDate = (date: Date) => {
  return format(date, 'dd/MM/yyyy');
};
