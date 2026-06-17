import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getProductByPcode } from "@/lib/products";
import ProductForm, { ProductFormValues } from "../../ProductForm";
import { updateProduct } from "../../actions";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductByPcode(id);

  if (!product) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const canManageProduct =
    product.creatorId === null || currentUser?.id === product.creatorId;

  if (!canManageProduct) {
    redirect(`/products/${product.pcode}`);
  }

  const initialValues: ProductFormValues = {
    ...product,
    tags: product.tags.join(", "),
  };
  const updateProductAction = updateProduct.bind(null, product.pcode);

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>상품 관리</p>
        <h1>상품 수정</h1>
        <p>{product.name}</p>
      </section>

      <ProductForm
        mode="edit"
        initialValues={initialValues}
        submitAction={updateProductAction}
        redirectHref={`/products/${product.pcode}`}
        cancelHref={`/products/${product.pcode}`}
      />
    </main>
  );
}
