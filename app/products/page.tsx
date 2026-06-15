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
  useCases: string[];
  tags: string[];
  description: string;
  rawSpec: string;
};

const products: Product[] = productsData;

const numberFormat = new Intl.NumberFormat("ko-KR");

function getSearchKeywords(query: string) {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function createSearchText(product: Product) {
  return [
    product.name,
    product.brand,
    product.cpu,
    product.gpu,
    product.os,
    product.description,
    product.rawSpec,
    product.useCases.join(" "),
    product.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();
}

function filterProducts(query: string) {
  const keywords = getSearchKeywords(query);

  if (keywords.length === 0) {
    return products;
  }

  return products.filter((product) => {
    const searchText = createSearchText(product);
    return keywords.every((keyword) => searchText.includes(keyword));
  });
}

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const searchQuery = q ?? "";
  const searchKeywords = getSearchKeywords(searchQuery);
  const visibleProducts = filterProducts(searchQuery);

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
              placeholder="예: 게임용, HP, RTX, 프리도스"
            />
            <button className={styles.searchButton} type="submit">
              검색
            </button>
          </div>
        </form>
        {searchKeywords.length > 0 ? (
          <div className={styles.conditionBar}>
            <div className={styles.conditionList} aria-label="적용된 검색어">
              {searchKeywords.map((keyword) => (
                <span className={styles.conditionChip} key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
            <Link className={styles.clearSearchLink} href="/products">
              초기화
            </Link>
          </div>
        ) : null}
      </section>

      <section className={styles.tableSection} aria-label="상품 목록">
        <div className={styles.tableHeader}>
          <h2>상품 {visibleProducts.length}개</h2>
          <p>
            {searchQuery
              ? `"${searchQuery}" 검색 결과입니다.`
              : "가격, 무게, 주요 스펙을 한 화면에서 비교합니다."}
          </p>
        </div>

        {visibleProducts.length > 0 ? (
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
                {visibleProducts.map((product) => (
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
        ) : (
          <div className={styles.emptyState}>
            <h3>검색 결과가 없습니다</h3>
            <p>상품명, 브랜드, CPU, GPU, OS, 태그에 포함된 단어로 다시 검색해보세요.</p>
            <Link href="/products">전체 상품 보기</Link>
          </div>
        )}
      </section>
    </main>
  );
}
