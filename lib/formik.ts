'use client';

import type { $FixMe } from '@/types';

export const scrollToError = (formik: $FixMe, inputRefs: $FixMe) => {
  const firstErrorKey = Object.keys(formik)[0] as keyof typeof inputRefs;
  console.log('firstErrorKey', firstErrorKey);
  if (firstErrorKey && inputRefs[firstErrorKey]?.current) {
    inputRefs[firstErrorKey].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};
