import React, { useState } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  submitText?: string;
  autoFocus?: boolean;
}

export default function CommentInput({
  onSubmit,
  placeholder = '写下你的评论...',
  submitText = '发布',
  autoFocus = false,
}: CommentInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="comment-input">
      <div className="comment-input__avatar">
        <div className="comment-avatar comment-avatar--placeholder">U</div>
      </div>
      <div className="comment-input__body">
        <textarea
          className="comment-input__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={3}
          autoFocus={autoFocus}
        />
        <div className="comment-input__actions">
          <span className="comment-input__hint">Ctrl + Enter 发送</span>
          <button
            className="comment-input__submit"
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
