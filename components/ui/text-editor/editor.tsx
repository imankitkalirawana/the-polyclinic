'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import EditorToolbar from './editor-toolbar';
import TextAlign from '@tiptap/extension-text-align';
import Strike from '@tiptap/extension-strike';
import { cn } from '@heroui/react';

export default function Editor({
  content,
  className,
  onChange,
}: {
  content?: string;
  className?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Strike,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={cn('rounded-small bg-default-100', className)}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="p-4" />
    </div>
  );
}
