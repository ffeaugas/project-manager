'use client';

import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code2,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface ITextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TextEditor = ({ value = '', onChange }: ITextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: {
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        italic: {
          HTMLAttributes: {
            class: 'italic',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: value || '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'h-[300px] w-full border-0 rounded-md p-2 px-4 bg-zinc-700 focus:outline-none overflow-auto',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = editor.getHTML();
      if (currentContent !== value) {
        editor.commands.setContent(value || '<p></p>');
      }
    }
  }, [editor, value]);

  return (
    <div className="space-y-2 w-full max-w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;

interface EditorState {
  color: string | undefined;
  isWhite: boolean;
  isRed: boolean;
  isBlue: boolean;
  isBold: boolean;
  canBold: boolean;
  isItalic: boolean;
  canItalic: boolean;
  isStrike: boolean;
  canStrike: boolean;
  isParagraph: boolean;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
  isCodeBlock: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

interface MenuOption {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  color?: string;
  onClick: (editor: Editor) => void;
  isActive?: (editorState: EditorState) => boolean;
  isDisabled?: (editorState: EditorState) => boolean;
  label: string;
  separator?: boolean;
}

interface IMenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: IMenuBarProps) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        color: ctx.editor?.getAttributes('textStyle').color,
        isWhite: ctx.editor?.isActive('textStyle', { color: 'white' }) ?? false,
        isRed: ctx.editor?.isActive('textStyle', { color: '#FBBC88' }) ?? false,
        isBlue: ctx.editor?.isActive('textStyle', { color: '#85D1F5' }) ?? false,
        isBold: ctx.editor?.isActive('bold') ?? false,
        canBold: ctx.editor?.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor?.isActive('italic') ?? false,
        canItalic: ctx.editor?.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor?.isActive('strike') ?? false,
        canStrike: ctx.editor?.can().chain().toggleStrike().run() ?? false,
        isParagraph: ctx.editor?.isActive('paragraph') ?? false,
        isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
        isBulletList: ctx.editor?.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
        canUndo: ctx.editor?.can().chain().undo().run() ?? false,
        canRedo: ctx.editor?.can().chain().redo().run() ?? false,
      };
    },
  });

  if (!editor || !editorState) return null;

  const menuOptions: MenuOption[] = [
    {
      icon: Bold,
      label: 'Bold',
      onClick: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (state) => state.isBold,
      isDisabled: (state) => !state.canBold,
    },
    {
      icon: Italic,
      label: 'Italic',
      onClick: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (state) => state.isItalic,
      isDisabled: (state) => !state.canItalic,
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough',
      onClick: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (state) => state.isStrike,
      isDisabled: (state) => !state.canStrike,
      separator: true,
    },
    {
      icon: AlignLeft,
      label: 'Align left',
      onClick: (editor) => editor.chain().focus().setTextAlign('left').run(),
    },
    {
      icon: AlignCenter,
      label: 'Align center',
      onClick: (editor) => editor.chain().focus().setTextAlign('center').run(),
    },
    {
      icon: AlignRight,
      label: 'Align right',
      onClick: (editor) => editor.chain().focus().setTextAlign('right').run(),
      separator: true,
    },
    {
      icon: Type,
      label: 'Paragraph',
      onClick: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: (state) => state.isParagraph,
    },
    {
      icon: Heading1,
      label: 'Heading 1',
      onClick: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: (state) => state.isHeading1,
    },
    {
      icon: Heading2,
      label: 'Heading 2',
      onClick: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: (state) => state.isHeading2,
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      onClick: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: (state) => state.isHeading3,
      separator: true,
    },
    {
      color: '#FFFFFF',
      label: 'Color',
      onClick: (editor) => editor.chain().focus().setColor('white').run(),
      isActive: (state) => state.isWhite,
    },
    {
      color: '#FBBC88',
      label: 'Color',
      onClick: (editor) => editor.chain().focus().setColor('#FBBC88').run(),
      isActive: (state) => state.isRed,
    },
    {
      color: '#85D1F5',
      label: 'Color',
      onClick: (editor) => editor.chain().focus().setColor('#85D1F5').run(),
      isActive: (state) => state.isBlue,
    },
    {
      icon: List,
      label: 'Bullet list',
      onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (state) => state.isBulletList,
    },
    {
      icon: ListOrdered,
      label: 'Ordered list',
      onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (state) => state.isOrderedList,
      separator: true,
    },
    {
      icon: Code2,
      label: 'Code block',
      onClick: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (state) => state.isCodeBlock,
    },
    {
      icon: Undo2,
      label: 'Undo',
      onClick: (editor) => editor.chain().focus().undo().run(),
      isDisabled: (state) => !state.canUndo,
    },
    {
      icon: Redo2,
      label: 'Redo',
      onClick: (editor) => editor.chain().focus().redo().run(),
      isDisabled: (state) => !state.canRedo,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border border-zinc-700 rounded-md bg-zinc-800">
      {menuOptions.map((option, index) => {
        const Icon = option.icon;
        const isActive = option.isActive?.(editorState) ?? false;
        const isDisabled = option.isDisabled?.(editorState) ?? false;

        return (
          <div key={index} className="flex items-center">
            <button
              onClick={() => option.onClick(editor)}
              disabled={isDisabled}
              title={option.label}
              type="button"
              className={`
                flex items-center justify-center p-2 rounded transition-colors
                ${
                  isActive
                    ? 'bg-zinc-700 text-white'
                    : 'text-zinc-400 hover:bg-zinc-700 hover:text-white'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {Icon && <Icon size={18} />}
              {option.color && (
                <div
                  className={`w-4 h-4 rounded-full`}
                  style={{ backgroundColor: option.color }}
                />
              )}
            </button>
            {option.separator && <div className="w-px h-6 mx-1 bg-zinc-600" />}
          </div>
        );
      })}
    </div>
  );
};
