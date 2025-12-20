'use client';

import { Button, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Editor, useEditorState } from '@tiptap/react';

export default function EditorToolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      let textAlign = editor.getAttributes('paragraph').textAlign;
      if (!textAlign) {
        textAlign = editor.getAttributes('heading').textAlign;
      }
      if (!textAlign) {
        const { $from } = editor.state.selection;
        const node = $from.parent;
        textAlign = node.attrs.textAlign || null;
      }

      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        textAlign,
      };
    },
  });

  return (
    <div className="flex flex-wrap gap-1 p-2">
      <Tooltip content="Bold" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Bold"
          variant={state.bold ? 'flat' : 'bordered'}
          color={state.bold ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleBold().run()}
        >
          <Icon icon="material-symbols:format-bold-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Italic" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Italic"
          variant={state.italic ? 'flat' : 'bordered'}
          color={state.italic ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleItalic().run()}
        >
          <Icon icon="material-symbols:format-italic-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Underline" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Underline"
          variant={state.underline ? 'flat' : 'bordered'}
          color={state.underline ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Icon icon="material-symbols:format-underlined-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Strikethrough" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Strikethrough"
          variant={state.strike ? 'flat' : 'bordered'}
          color={state.strike ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleStrike().run()}
        >
          <Icon icon="material-symbols:strikethrough-s-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Bullet List" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Bullet List"
          variant={state.bulletList ? 'flat' : 'bordered'}
          color={state.bulletList ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleBulletList().run()}
        >
          <Icon icon="material-symbols:format-list-bulleted-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Ordered List" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Ordered List"
          variant={state.orderedList ? 'flat' : 'bordered'}
          color={state.orderedList ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <Icon icon="material-symbols:format-list-numbered-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Align Left" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Align Left"
          variant={state.textAlign === 'left' || state.textAlign === null ? 'flat' : 'bordered'}
          color={state.textAlign === 'left' || state.textAlign === null ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <Icon icon="material-symbols:format-align-left-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Align Center" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Align Center"
          variant={state.textAlign === 'center' ? 'flat' : 'bordered'}
          color={state.textAlign === 'center' ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <Icon icon="material-symbols:format-align-center-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Align Right" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Align Right"
          variant={state.textAlign === 'right' ? 'flat' : 'bordered'}
          color={state.textAlign === 'right' ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <Icon icon="material-symbols:format-align-right-rounded" width={16} />
        </Button>
      </Tooltip>

      <Tooltip content="Align Justify" delay={500}>
        <Button
          isIconOnly
          size="sm"
          aria-label="Align Justify"
          variant={state.textAlign === 'justify' ? 'flat' : 'bordered'}
          color={state.textAlign === 'justify' ? 'primary' : 'default'}
          onPress={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <Icon icon="material-symbols:format-align-justify-rounded" width={16} />
        </Button>
      </Tooltip>
    </div>
  );
}
