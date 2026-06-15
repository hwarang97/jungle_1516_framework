"use client";

import Link from "next/link";
import type { SubmitEvent } from "react";
import { useState } from "react";
import styles from "./ProductForm.module.css";

export type ProductFormValues = {
  name?: string;
  brand?: string;
  priceKrw?: number;
  productUrl?: string;
  cpu?: string;
  gpu?: string;
  ramGb?: number;
  storageGb?: number;
  displayInch?: number;
  weightKg?: number;
  os?: string;
  tags?: string;
  description?: string;
  rawSpec?: string;
};

type ProductFormProps = {
  mode: "create" | "edit";
  initialValues?: ProductFormValues;
};

export default function ProductForm({ mode, initialValues }: ProductFormProps) {
  const [message, setMessage] = useState("");
  const submitLabel = mode === "create" ? "상품 등록" : "상품 수정";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`${submitLabel} 입력값을 확인했습니다.`);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <h2>기본 정보</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            상품명
            <input name="name" required defaultValue={initialValues?.name ?? ""} />
          </label>
          <label className={styles.field}>
            브랜드
            <input name="brand" required defaultValue={initialValues?.brand ?? ""} />
          </label>
          <label className={styles.field}>
            가격
            <input
              name="priceKrw"
              type="number"
              required
              min="0"
              defaultValue={initialValues?.priceKrw ?? ""}
            />
          </label>
          <label className={styles.field}>
            OS
            <input name="os" required defaultValue={initialValues?.os ?? ""} />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>주요 스펙</h2>
        <div className={styles.grid}>
          <label className={styles.field}>
            CPU
            <input name="cpu" required defaultValue={initialValues?.cpu ?? ""} />
          </label>
          <label className={styles.field}>
            GPU
            <input name="gpu" required defaultValue={initialValues?.gpu ?? ""} />
          </label>
          <label className={styles.field}>
            RAM(GB)
            <input
              name="ramGb"
              type="number"
              required
              min="0"
              defaultValue={initialValues?.ramGb ?? ""}
            />
          </label>
          <label className={styles.field}>
            SSD(GB)
            <input
              name="storageGb"
              type="number"
              required
              min="0"
              defaultValue={initialValues?.storageGb ?? ""}
            />
          </label>
          <label className={styles.field}>
            화면 크기(inch)
            <input
              name="displayInch"
              type="number"
              required
              min="0"
              step="0.1"
              defaultValue={initialValues?.displayInch ?? ""}
            />
          </label>
          <label className={styles.field}>
            무게(kg)
            <input
              name="weightKg"
              type="number"
              required
              min="0"
              step="0.001"
              defaultValue={initialValues?.weightKg ?? ""}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>설명과 태그</h2>
        <label className={styles.field}>
          태그
          <input name="tags" defaultValue={initialValues?.tags ?? ""} />
        </label>
        <label className={styles.field}>
          한 줄 설명
          <textarea
            name="description"
            rows={3}
            defaultValue={initialValues?.description ?? ""}
          />
        </label>
        <label className={styles.field}>
          원본 상품 URL
          <input name="productUrl" type="url" defaultValue={initialValues?.productUrl ?? ""} />
        </label>
        <label className={styles.field}>
          원본 스펙
          <textarea name="rawSpec" rows={5} defaultValue={initialValues?.rawSpec ?? ""} />
        </label>
      </section>

      <div className={styles.actions}>
        <Link className={styles.secondaryLink} href="/products">
          취소
        </Link>
        <button className={styles.primaryButton} type="submit">
          {submitLabel}
        </button>
      </div>

      {message ? <p className={styles.message}>{message}</p> : null}
    </form>
  );
}
