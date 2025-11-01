'use client';

import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
  Quote,
  CornerDownLeft,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface ITextEditorProps {
  id: string;
}

const TextEditor = ({ id }: ITextEditorProps) => {
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
    ],
    content: '<p>Hello World!</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'h-[300px] w-full border-0 rounded-md p-2 bg-zinc-700 focus:outline-none',
      },
    },
  });

  return (
    <div className="space-y-2">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TextEditor;

interface MenuOption {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: (editor: Editor) => void;
  isActive?: (editorState: any) => boolean;
  isDisabled?: (editorState: any) => boolean;
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
        isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
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
    },
    {
      icon: AlignLeft,
      label: 'Align left',
      onClick: (editor) => editor.chain().focus().setTextAlign('left').run(),
      separator: true,
    },
    {
      icon: AlignCenter,
      label: 'Align center',
      onClick: (editor) => editor.chain().focus().setTextAlign('center').run(),
      separator: true,
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
      separator: true,
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
      icon: Quote,
      label: 'Blockquote',
      onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (state) => state.isBlockquote,
      separator: true,
    },
    {
      icon: CornerDownLeft,
      label: 'Hard break',
      onClick: (editor) => editor.chain().focus().setHardBreak().run(),
      separator: true,
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
              <Icon size={18} />
            </button>
            {option.separator && <div className="w-px h-6 mx-1 bg-zinc-600" />}
          </div>
        );
      })}
    </div>
  );
};
