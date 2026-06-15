"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import styles from "../auth.module.css";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/products");
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>계정</p>
          <h1>로그인</h1>
          <p>상품 등록과 리뷰 작성을 위해 이메일로 로그인합니다.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            이메일
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>

          <label className={styles.field}>
            비밀번호
            <input name="password" type="password" required placeholder="비밀번호" />
          </label>

          <button className={styles.primaryButton} type="submit">
            로그인
          </button>
        </form>

        <p className={styles.switchText}>
          계정이 없다면 <Link href="/signup">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
