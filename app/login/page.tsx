"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "../auth.module.css";

const initialState: LoginState = {
  error: null,
  fields: {
    email: "",
    password: "",
  },
  formKey: 0,
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/products";
  const signupSuccess = searchParams.get("signup") === "success";
  const signupEmail = searchParams.get("email") ?? "";
  const [state, formAction, isPending] = useActionState(login, initialState);
  const emailValue = state.fields.email || signupEmail;

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>계정</p>
          <h1>로그인</h1>
          <p>상품 등록과 리뷰 작성을 위해 이메일로 로그인합니다.</p>
        </div>

        {signupSuccess ? (
          <p className={styles.successMessage}>회원가입이 완료되었습니다. 로그인해주세요.</p>
        ) : null}

        <form className={styles.form} action={formAction} key={state.formKey}>
          <input name="next" type="hidden" value={nextPath} />

          <label className={styles.field}>
            이메일
            <input
              name="email"
              type="email"
              required
              placeholder="name@example.com"
              defaultValue={emailValue}
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

          {state.error ? <p className={styles.errorMessage}>{state.error}</p> : null}

          <button className={styles.primaryButton} type="submit" disabled={isPending}>
            {isPending ? "확인 중" : "로그인"}
          </button>
        </form>

        <p className={styles.switchText}>
          계정이 없다면 <Link href="/signup">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
