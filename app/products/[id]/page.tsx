import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductByPcode } from "@/lib/products";
import { getProductImageSrc } from "@/lib/productImages";
import CommentSection from "./CommentSection";
import DeleteProductButton from "./DeleteProductButton";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const numberFormat = new Intl.NumberFormat("ko-KR");

function formatBoolean(value: boolean | null) {
  if (value === null) {
    return "-";
  }

  return value ? "가능" : "불가능";
}

function formatEmpty(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params; // 요청 URL에 의존하는 변수임을 명시 (정적 페이지로 만들기 어렵다는 뜻, 캐싱 힘듬)
  const product = await getProductByPcode(id);

  if (!product) {
    notFound();
  }

  const specs = [
    { label: "CPU", value: product.cpu },
    { label: "GPU", value: product.gpu },
    { label: "NPU", value: product.npuTops ? `${product.npuTops}TOPS` : "-" },
    { label: "RAM", value: `${product.ramGb}GB` },
    { label: "RAM 교체", value: formatBoolean(product.ramUpgradeable) },
    { label: "저장공간", value: `${product.storageGb}GB` },
    { label: "저장 슬롯", value: product.storageSlotCount ? `${product.storageSlotCount}개` : "-" },
    { label: "화면 크기", value: `${product.displayInch}인치` },
    { label: "해상도", value: product.displayResolution },
    { label: "주사율", value: product.displayRefreshHz ? `${product.displayRefreshHz}Hz` : "-" },
    {
      label: "밝기",
      value: product.displayBrightnessNit ? `${product.displayBrightnessNit}nit` : "-",
    },
    { label: "무게", value: `${product.weightKg}kg` },
    { label: "OS", value: product.os },
    { label: "배터리", value: product.batteryWh ? `${product.batteryWh}Wh` : "-" },
    {
      label: "최대 사용 시간",
      value: product.batteryMaxHours ? `${product.batteryMaxHours}시간` : "-",
    },
    { label: "전원", value: product.power },
  ];

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/products">
        목록으로 돌아가기
      </Link>

      <section className={styles.hero}>
        <div className={styles.imagePanel}>
          <Image
            className={styles.productImage}
            src={getProductImageSrc(product.imageUrl)}
            alt={`${product.name} 대표 이미지`}
            width={220}
            height={220}
          />
        </div>
        <div>
          <p className={styles.brand}>{product.brand}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
        </div>
        <div className={styles.priceBox}>
          <span>현재 기준 가격</span>
          <strong>{numberFormat.format(product.priceKrw)}원</strong>
          <div className={styles.detailActions}>
            <a className={styles.actionLink} href={product.productUrl} target="_blank" rel="noreferrer">
              원본 상품 페이지
            </a>
            <Link className={styles.secondaryActionLink} href={`/products/${product.pcode}/edit`}>
              수정
            </Link>
            <DeleteProductButton productName={product.name} />
          </div>
        </div>
      </section>

      <section className={styles.summaryGrid} aria-label="핵심 요약">
        <div>
          <span>용도</span>
          <strong>{product.useCases.join(", ")}</strong>
        </div>
        <div>
          <span>CPU / GPU</span>
          <strong>
            {product.cpu} / {product.gpu}
          </strong>
        </div>
        <div>
          <span>화면 / 무게</span>
          <strong>
            {product.displayInch}인치 / {product.weightKg}kg
          </strong>
        </div>
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.panel}>
          <h2>상세 스펙</h2>
          <dl className={styles.specList}>
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{formatEmpty(spec.value)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className={styles.panel}>
          <h2>태그</h2>
          <div className={styles.tagList}>
            {product.tags.map((tag) => (
              <span className={styles.tag} key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <h2 className={styles.asideTitle}>원본 스펙</h2>
          <p className={styles.rawSpec}>{product.rawSpec}</p>
          <p className={styles.collectedAt}>수집일: {product.collectedAt}</p>
        </aside>
      </section>

      <CommentSection />
    </main>
  );
}
