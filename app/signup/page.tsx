"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import styles from "../auth.module.css";

export default function SignupPage() {
  const router = useRouter();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/login");
  }

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>계정</p>
          <h1>회원가입</h1>
          <p>노트북 상품 관리와 의견 작성을 위한 계정을 만듭니다.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            이름
            <input name="name" required placeholder="홍길동" />
          </label>

          <label className={styles.field}>
            이메일
            <input name="email" type="email" required placeholder="name@example.com" />
          </label>

          <label className={styles.field}>
            비밀번호
            <input name="password" type="password" required placeholder="비밀번호" />
          </label>

          <label className={styles.field}>
            비밀번호 확인
            <input name="passwordConfirm" type="password" required placeholder="비밀번호 확인" />
          </label>

          <button className={styles.primaryButton} type="submit">
            회원가입
          </button>
        </form>

        <p className={styles.switchText}>
          이미 계정이 있다면 <Link href="/login">로그인</Link>
        </p>
      </section>
    </main>
  );
}
