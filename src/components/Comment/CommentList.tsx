import { useState } from 'react';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';
import type { Comment, Reply } from './types';
import './Comment.css';

let nextId = 100;
function generateId(): string {
  return String(nextId++);
}

function createNow(): string {
  return new Date().toISOString();
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    username: '张三',
    avatar: '',
    content: '这个项目搭建得很不错，Vite 的开发体验确实比 Webpack 好很多！',
    createdAt: '2026-03-17T10:30:00.000Z',
    likes: 5,
    liked: false,
    replies: [
      {
        id: '1-1',
        username: '李四',
        avatar: '',
        content: '同意，热更新速度快了很多。',
        createdAt: '2026-03-17T11:15:00.000Z',
        likes: 2,
        liked: false,
      },
    ],
  },
  {
    id: '2',
    username: '王五',
    avatar: '',
    content: '主题切换功能做得很丝滑，暗色模式很好看。',
    createdAt: '2026-03-16T14:20:00.000Z',
    likes: 3,
    liked: false,
    replies: [],
  },
  {
    id: '3',
    username: '赵六',
    avatar: '',
    content: '期待后续能加更多功能，比如用户认证和数据持久化。',
    createdAt: '2026-03-14T09:05:00.000Z',
    likes: 1,
    liked: false,
    replies: [],
  },
];

export default function CommentList() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: generateId(),
      username: '当前用户',
      avatar: '',
      content,
      createdAt: createNow(),
      likes: 0,
      liked: false,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: c.replies.map((r) =>
                r.id === replyId
                  ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                  : r
              ),
            }
          : c
      )
    );
  };

  const handleReply = (commentId: string, content: string) => {
    const newReply: Reply = {
      id: generateId(),
      username: '当前用户',
      avatar: '',
      content,
      createdAt: createNow(),
      likes: 0,
      liked: false,
    };
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
      )
    );
  };

  return (
    <section className="comment-section">
      <h2 className="comment-section__title">评论 ({comments.length})</h2>
      <CommentInput onSubmit={handleAddComment} />
      <div className="comment-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onLikeReply={handleLikeReply}
            onReply={handleReply}
          />
        ))}
      </div>
    </section>
  );
}
