import Link from "next/link";
import type { ProductComment } from "@/lib/comments";
import styles from "./page.module.css";

type CommentSectionProps = {
  comments: ProductComment[];
  createAction: (formData: FormData) => void | Promise<void>;
  currentUserName: string | null;
};

export default function CommentSection({
  comments,
  createAction,
  currentUserName,
}: CommentSectionProps) {
  const canComment = Boolean(currentUserName);

  return (
    <section className={styles.commentSection} aria-label="댓글">
      <div className={styles.commentHeader}>
        <h2>댓글</h2>
        <span>{comments.length}개</span>
      </div>

      {canComment ? (
        <form className={styles.commentForm} action={createAction}>
          <label className={styles.commentLabel} htmlFor="comment-content">
            댓글 작성
          </label>
          <textarea
            id="comment-content"
            name="content"
            rows={4}
            required
            placeholder="상품을 비교하면서 확인한 점이나 의견을 남겨보세요."
          />
          <button type="submit">댓글 작성</button>
        </form>
      ) : (
        <div className={styles.loginRequired}>
          <p>댓글을 작성하려면 로그인이 필요합니다.</p>
          <Link href="/login">로그인</Link>
        </div>
      )}

      <div className={styles.commentList}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <article className={styles.commentItem} key={comment.id}>
              <div className={styles.commentMeta}>
                <strong>{comment.author}</strong>
                <span>{comment.createdAt}</span>
              </div>
              <p>{comment.content}</p>
            </article>
          ))
        ) : (
          <article className={styles.commentItem}>
            <p>아직 댓글이 없습니다.</p>
          </article>
        )}
      </div>
    </section>
  );
}
