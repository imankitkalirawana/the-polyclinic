'use client';

export const scrollToError = (formik: any, inputRefs: any) => {
  const firstErrorKey = Object.keys(formik)[0] as keyof typeof inputRefs;
  console.log('firstErrorKey', firstErrorKey);
  if (firstErrorKey && inputRefs[firstErrorKey]?.current) {
    inputRefs[firstErrorKey].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    return;
  }
};
