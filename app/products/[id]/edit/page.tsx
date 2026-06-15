import { notFound } from "next/navigation";
import ProductForm, { ProductFormValues } from "../../ProductForm";
import productsData from "@/data/products.json";
import styles from "./page.module.css";

type Product = {
  pcode: string;
  name: string;
  brand: string;
  priceKrw: number;
  productUrl: string;
  cpu: string;
  gpu: string;
  ramGb: number;
  storageGb: number;
  displayInch: number;
  weightKg: number;
  os: string;
  tags: string[];
  description: string;
  rawSpec: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const products: Product[] = productsData;

export default async function ProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const product = products.find((item) => item.pcode === id);

  if (!product) {
    notFound();
  }

  const initialValues: ProductFormValues = {
    ...product,
    tags: product.tags.join(", "),
  };

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
        redirectHref={`/products/${product.pcode}`}
        cancelHref={`/products/${product.pcode}`}
      />
    </main>
  );
}
