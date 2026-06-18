"use client";

import type { SubmitEvent } from "react";
import styles from "./page.module.css";

type DeleteProductButtonProps = {
  productName: string;
  deleteAction: () => void | Promise<void>;
};

export default function DeleteProductButton({
  productName,
  deleteAction,
}: DeleteProductButtonProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    const confirmed = window.confirm(`${productName} 상품을 삭제할까요?`);

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteAction} onSubmit={handleSubmit}>
      <button className={styles.dangerButton} type="submit">
        삭제
      </button>
    </form>
  );
}
