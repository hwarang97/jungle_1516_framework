"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type SignupState } from "./actions";
import styles from "../auth.module.css";

const initialState: SignupState = {
  error: null,
  fields: {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  },
  formKey: 0,
};

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>계정</p>
          <h1>회원가입</h1>
          <p>노트북 상품 관리와 의견 작성을 위한 계정을 만듭니다.</p>
        </div>

        <form className={styles.form} action={formAction} key={state.formKey}>
          <label className={styles.field}>
            이름
            <input name="name" required placeholder="홍길동" defaultValue={state.fields.name} />
          </label>

          <label className={styles.field}>
            이메일
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              defaultValue={state.fields.email}
            />
          </label>

          <label className={styles.field}>
            비밀번호
            <input
              name="password"
              type="password"
              required
              placeholder="비밀번호"
              defaultValue={state.fields.password}
            />
          </label>

          <label className={styles.field}>
            비밀번호 확인
            <input
              name="passwordConfirm"
              type="password"
              required
              placeholder="비밀번호 확인"
              defaultValue={state.fields.passwordConfirm}
            />
          </label>

          {state.error ? <p className={styles.errorMessage}>{state.error}</p> : null}

          <button className={styles.primaryButton} type="submit" disabled={isPending}>
            {isPending ? "가입 중" : "회원가입"}
          </button>
        </form>

        <p className={styles.switchText}>
          이미 계정이 있다면 <Link href="/login">로그인</Link>
        </p>
      </section>
    </main>
  );
}
