"use client";

import type { SubmitEvent } from "react";
import { useState } from "react";
import styles from "./page.module.css";

type Comment = {
  id: number;
  author: string;
  content: string;
  createdAt: string;
};

const initialComments: Comment[] = [
  {
    id: 1,
    author: "김정글",
    content: "외부 모니터 연결 여부와 포트 구성이 상세 페이지에서 더 잘 보이면 좋겠습니다.",
    createdAt: "2026-06-16",
  },
  {
    id: 2,
    author: "이사용자",
    content: "무게와 배터리 시간이 같이 보여서 휴대용 후보를 비교하기 편합니다.",
    createdAt: "2026-06-16",
  },
];

export default function CommentSection() {
  const [comments, setComments] = useState(initialComments);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const content = String(formData.get("content") ?? "").trim();

    if (!content) {
      return;
    }

    const nextComment: Comment = {
      id: Date.now(),
      author: "임시 사용자",
      content,
      createdAt: "방금 전",
    };

    setComments((currentComments) => [nextComment, ...currentComments]);
    event.currentTarget.reset();
  }

  return (
    <section className={styles.commentSection} aria-label="댓글">
      <div className={styles.commentHeader}>
        <h2>댓글</h2>
        <span>{comments.length}개</span>
      </div>

      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <label className={styles.commentLabel} htmlFor="comment-content">
          댓글 작성
        </label>
        <textarea
          id="comment-content"
          name="content"
          rows={4}
          placeholder="상품을 비교하면서 확인한 점이나 의견을 남겨보세요."
        />
        <button type="submit">댓글 작성</button>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <article className={styles.commentItem} key={comment.id}>
            <div className={styles.commentMeta}>
              <strong>{comment.author}</strong>
              <span>{comment.createdAt}</span>
            </div>
            <p>{comment.content}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
