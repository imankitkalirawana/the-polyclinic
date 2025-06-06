import { Selection } from '@heroui/react';

export const isAll = (selection: Selection): selection is 'all' =>
  selection === 'all';

export const convertSelectionToKeys = (selection: Selection) => {
  let keys = [];
  if (isAll(selection)) {
    keys = [-1];
  } else {
    keys = Array.from(selection);
  }
  return keys;
};
