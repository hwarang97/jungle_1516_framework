import Link from "next/link";
import productsData from "@/data/products.json";
import styles from "./page.module.css";

type Product = {
  pcode: string;
  name: string;
  brand: string;
  priceKrw: number;
  cpu: string;
  gpu: string;
  ramGb: number;
  storageGb: number;
  displayInch: number;
  weightKg: number;
  os: string;
  tags: string[];
};

const products: Product[] = productsData;

const selectedConditions = [
  "200만원 전후",
  "15~16인치",
  "RAM 16GB 이상",
  "SSD 512GB 이상",
  "휴대성 고려",
];

const numberFormat = new Intl.NumberFormat("ko-KR");

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const searchQuery =
    q ?? "200만원 전후, 16인치, 가볍고 외부 모니터 연결이 가능한 노트북";

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>검색 결과</p>
          <h1>조건에 맞는 노트북</h1>
          <p className={styles.description}>
            자연어 검색 결과를 상품 비교 목록으로 정리하는 화면입니다.
          </p>
        </div>
        <Link className={styles.primaryLink} href="/products/new">
          상품 등록
        </Link>
      </section>

      <section className={styles.searchPanel} aria-label="검색 조건">
        <form action="/products">
          <label className={styles.searchLabel} htmlFor="product-search">
            검색 문장
          </label>
          <div className={styles.searchRow}>
            <input
              id="product-search"
              name="q"
              className={styles.searchInput}
              defaultValue={searchQuery}
            />
            <button className={styles.searchButton} type="submit">
              검색
            </button>
          </div>
        </form>
        <div className={styles.conditionList} aria-label="적용된 조건">
          {selectedConditions.map((condition) => (
            <span className={styles.conditionChip} key={condition}>
              {condition}
            </span>
          ))}
        </div>
      </section>

      <section className={styles.tableSection} aria-label="상품 목록">
        <div className={styles.tableHeader}>
          <h2>상품 {products.length}개</h2>
          <p>가격, 무게, 주요 스펙을 한 화면에서 비교합니다.</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>CPU / GPU</th>
                <th>메모리 / 저장공간</th>
                <th>화면 / 무게</th>
                <th>OS</th>
                <th>태그</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.pcode}>
                  <td>
                    <Link className={styles.productName} href={`/products/${product.pcode}`}>
                      {product.name}
                    </Link>
                    <p className={styles.brand}>{product.brand}</p>
                  </td>
                  <td>{numberFormat.format(product.priceKrw)}원</td>
                  <td>
                    <div className={styles.specStack}>
                      <span>{product.cpu}</span>
                      <span>{product.gpu}</span>
                    </div>
                  </td>
                  <td>
                    {product.ramGb}GB / {product.storageGb}GB
                  </td>
                  <td>
                    {product.displayInch}인치 / {product.weightKg}kg
                  </td>
                  <td>{product.os}</td>
                  <td>
                    <div className={styles.tagList}>
                      {product.tags.map((tag) => (
                        <span className={styles.tag} key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
