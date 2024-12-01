'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ReactQuill from 'react-quill';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  theme?: string;
  className?: string;
  id?: string;
  label?: string;
  description?: string;
}

export default function QuillInput({
  theme = 'snow',
  value,
  onChange,
  placeholder,
  className,
  id,
  label,
  description
}: Props) {
  const formats = ['bold', 'italic', 'underline', 'strike'];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <div
        className={cn(
          'relative rounded-2xl bg-default-100 p-4 py-2 transition-all hover:bg-default-200',
          { 'pt-0': isFocused || value }
        )}
      >
        <label
          htmlFor={id}
          className={cn('text-sm text-default-500 transition-all', {
            'text-xs': isFocused || value
          })}
        >
          {label}
        </label>
        <ReactQuill
          id={id}
          theme={theme}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          formats={formats}
          className={cn('quill-input', className)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      <p className="pl-2 text-xs text-default-400">{description}</p>
    </div>
  );
}
