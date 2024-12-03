'use client';

export const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const currentDate = new Date();
  const age =
    currentDate.getFullYear() -
    birthDate.getFullYear() -
    (currentDate <
    new Date(
      currentDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    )
      ? 1
      : 0);
  return age;
};

export const calculateDOB = (age: number) => {
  const currentDate = new Date();
  const birthYear = currentDate.getFullYear() - age;
  return new Date(birthYear, currentDate.getMonth(), currentDate.getDate())
    .toISOString()
    .split('T')[0]; // Returns DOB in "YYYY-MM-DD" format
};
