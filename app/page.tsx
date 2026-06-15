"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import styles from "./page.module.css";

const examples = [
  "200만원 전후, 16인치, 가볍고 외부 모니터 연결이 가능한 노트북",
  "게임보다는 개발과 문서 작업 위주로 쓸 가성비 노트북",
];

export default function HomePage() {
  const router = useRouter();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/products");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="노트북 검색">
        <p className={styles.eyebrow}>AI 노트북 구매 보조</p>
        <h1>원하는 상황을 문장으로 입력하세요</h1>
        <p className={styles.description}>
          복잡한 스펙을 직접 고르기 전에, 필요한 조건을 자연어로 정리하고 상품 목록으로 이동합니다.
        </p>

        <form className={styles.searchBox} onSubmit={handleSubmit}>
          <label className={styles.searchLabel} htmlFor="home-search">
            검색 문장
          </label>
          <div className={styles.searchRow}>
            <input
              id="home-search"
              name="query"
              className={styles.searchInput}
              placeholder="예: 200만원 이하, 16인치, 가벼운 개발용 노트북"
            />
            <button className={styles.searchButton} type="submit">
              검색
            </button>
          </div>
        </form>

        <div className={styles.examples} aria-label="검색 예시">
          {examples.map((example) => (
            <button
              className={styles.exampleButton}
              key={example}
              type="button"
              onClick={() => router.push("/products")}
            >
              {example}
            </button>
          ))}
        </div>

        <Link className={styles.listLink} href="/products">
          전체 상품 목록 보기
        </Link>
      </section>
    </main>
  );
}
