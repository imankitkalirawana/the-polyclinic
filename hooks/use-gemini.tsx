'use client';

import { useMutation } from '@tanstack/react-query';

export const useGemini = () => {
  const mutation = useMutation({
    mutationFn: async ({ prompt, context }: { prompt: string; context: string }) => {
      const response = await fetch('/api/ai/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, context }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    },
  });

  return mutation;
};
