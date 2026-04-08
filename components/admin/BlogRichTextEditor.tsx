'use client';

import { Bold, Heading2, Heading3, Italic, Link2, List, ListOrdered, Quote, Undo2 } from 'lucide-react';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect } from 'react';

type EditorAction =
  | 'bold'
  | 'italic'
  | 'bulletList'
  | 'orderedList'
  | 'heading2'
  | 'heading3'
  | 'blockquote'
  | 'clear';

const editorActions: Array<{
  label: string;
  icon: typeof Bold;
  action: EditorAction;
}> = [
  { label: 'Bold', icon: Bold, action: 'bold' },
  { label: 'Italic', icon: Italic, action: 'italic' },
  { label: 'Heading 2', icon: Heading2, action: 'heading2' },
  { label: 'Heading 3', icon: Heading3, action: 'heading3' },
  { label: 'Bullet list', icon: List, action: 'bulletList' },
  { label: 'Numbered list', icon: ListOrdered, action: 'orderedList' },
  { label: 'Quote', icon: Quote, action: 'blockquote' },
  { label: 'Clear formatting', icon: Undo2, action: 'clear' },
];

export default function BlogRichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['http', 'https', 'mailto'],
      }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class: 'blog-content min-h-[280px] w-full px-4 py-4 text-[#665459] outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  function runAction(action: EditorAction) {
    if (!editor) return;

    const chain = editor.chain().focus();

    if (action === 'bold') {
      chain.toggleBold().run();
      return;
    }

    if (action === 'italic') {
      chain.toggleItalic().run();
      return;
    }

    if (action === 'bulletList') {
      chain.toggleBulletList().run();
      return;
    }

    if (action === 'orderedList') {
      chain.toggleOrderedList().run();
      return;
    }

    if (action === 'heading2') {
      chain.toggleHeading({ level: 2 }).run();
      return;
    }

    if (action === 'heading3') {
      chain.toggleHeading({ level: 3 }).run();
      return;
    }

    if (action === 'blockquote') {
      chain.toggleBlockquote().run();
      return;
    }

    chain.clearNodes().unsetAllMarks().run();
  }

  function handleLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const nextUrl = window.prompt('Enter a URL', previousUrl ?? '');

    if (nextUrl === null) return;

    if (!nextUrl.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: nextUrl.trim() }).run();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline/20 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-outline/10 bg-surface-container-lowest px-4 py-3">
        {editorActions.map(({ label, icon: Icon, action }) => {
          const isActive =
            action === 'bold'
              ? editor?.isActive('bold')
              : action === 'italic'
                ? editor?.isActive('italic')
                : action === 'bulletList'
                  ? editor?.isActive('bulletList')
                  : action === 'orderedList'
                    ? editor?.isActive('orderedList')
                    : action === 'heading2'
                      ? editor?.isActive('heading', { level: 2 })
                      : action === 'heading3'
                        ? editor?.isActive('heading', { level: 3 })
                        : action === 'blockquote'
                          ? editor?.isActive('blockquote')
                          : false;

          return (
            <button
              key={action}
              type="button"
              onClick={() => runAction(action)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? 'border-primary bg-primary text-on-primary'
                  : 'border-outline/20 bg-white text-on-surface hover:bg-surface-container'
              }`}
              aria-label={label}
              title={label}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleLink}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
            editor?.isActive('link')
              ? 'border-primary bg-primary text-on-primary'
              : 'border-outline/20 bg-white text-on-surface hover:bg-surface-container'
          }`}
          aria-label="Link"
          title="Link"
        >
          <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Link</span>
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
