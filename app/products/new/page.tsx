import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";
import styles from "./page.module.css";

export default async function ProductNewPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?next=/products/new");
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>상품 관리</p>
        <h1>상품 등록</h1>
        <p>노트북 상품의 기본 정보와 주요 스펙을 입력합니다.</p>
      </section>

      <ProductForm mode="create" submitAction={createProduct} redirectHref="/products" />
    </main>
  );
}
