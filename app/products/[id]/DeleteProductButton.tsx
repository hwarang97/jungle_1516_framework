"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";

type DeleteProductButtonProps = {
  productName: string;
};

export default function DeleteProductButton({ productName }: DeleteProductButtonProps) {
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `${productName} 상품 삭제 흐름을 확인합니다. 현재는 DB 연결 전이라 실제 데이터는 삭제되지 않습니다.`,
    );

    if (confirmed) {
      router.push("/products");
    }
  }

  return (
    <button className={styles.dangerButton} type="button" onClick={handleDelete}>
      삭제
    </button>
  );
}
