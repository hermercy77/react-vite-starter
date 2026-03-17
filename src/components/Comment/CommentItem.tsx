import React, { useState } from 'react';
import CommentInput from './CommentInput';
import type { Comment, Reply } from './types';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function ReplyItem({
  reply,
  onLike,
}: {
  reply: Reply;
  onLike: () => void;
}) {
  return (
    <div className="comment-reply">
      <div className="comment-reply__avatar">
        <div className="comment-avatar comment-avatar--small">
          {reply.username.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="comment-reply__body">
        <div className="comment-reply__header">
          <span className="comment-reply__username">{reply.username}</span>
          <span className="comment-reply__time">{formatTime(reply.createdAt)}</span>
        </div>
        <p className="comment-reply__content">{reply.content}</p>
        <div className="comment-reply__actions">
          <button
            className={`comment-action-btn${reply.liked ? ' comment-action-btn--active' : ''}`}
            onClick={onLike}
            aria-label={reply.liked ? '取消点赞' : '点赞'}
          >
            <svg className="comment-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{reply.likes || ''}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommentItem({
  comment,
  onLike,
  onLikeReply,
  onReply,
}: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [repliesExpanded, setRepliesExpanded] = useState(true);

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setShowReplyInput(false);
  };

  const replyCount = comment.replies.length;

  return (
    <div className="comment-item">
      <div className="comment-item__avatar">
        <div className="comment-avatar">
          {comment.username.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="comment-item__body">
        <div className="comment-item__header">
          <span className="comment-item__username">{comment.username}</span>
          <span className="comment-item__time">{formatTime(comment.createdAt)}</span>
        </div>
        <p className="comment-item__content">{comment.content}</p>
        <div className="comment-item__actions">
          <button
            className={`comment-action-btn${comment.liked ? ' comment-action-btn--active' : ''}`}
            onClick={() => onLike(comment.id)}
            aria-label={comment.liked ? '取消点赞' : '点赞'}
          >
            <svg className="comment-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>{comment.likes || ''}</span>
          </button>
          <button
            className="comment-action-btn"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <svg className="comment-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>回复</span>
          </button>
          {replyCount > 0 && (
            <button
              className="comment-action-btn"
              onClick={() => setRepliesExpanded(!repliesExpanded)}
            >
              <span>{repliesExpanded ? '收起' : `展开 ${replyCount} 条回复`}</span>
            </button>
          )}
        </div>

        {showReplyInput && (
          <div className="comment-item__reply-input">
            <CommentInput
              onSubmit={handleReply}
              placeholder={`回复 ${comment.username}...`}
              submitText="回复"
              autoFocus
            />
          </div>
        )}

        {replyCount > 0 && repliesExpanded && (
          <div className="comment-replies">
            {comment.replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                onLike={() => onLikeReply(comment.id, reply.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
