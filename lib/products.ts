import type { Product, ProductTag, Tag } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type ProductWithTags = Product & {
  productTags: Array<ProductTag & { tag: Tag }>;
};

export type ProductListItem = {
  pcode: string;
  name: string;
  brand: string;
  priceKrw: number;
  imageUrl: string;
  productUrl: string;
  cpu: string;
  gpu: string;
  npuTops: number | null;
  ramGb: number;
  ramUpgradeable: boolean | null;
  storageGb: number;
  storageSlotCount: number | null;
  displayInch: number;
  displayResolution: string | null;
  displayRefreshHz: number | null;
  displayBrightnessNit: number | null;
  weightKg: number;
  os: string;
  batteryWh: number | null;
  batteryMaxHours: number | null;
  power: string | null;
  useCases: string[];
  tags: string[];
  description: string;
  rawSpec: string;
  collectedAt: string | null;
};

function mapProduct(product: ProductWithTags): ProductListItem {
  return {
    pcode: product.pcode,
    name: product.name,
    brand: product.brand,
    priceKrw: product.priceKrw,
    imageUrl: product.imageUrl,
    productUrl: product.productUrl,
    cpu: product.cpu,
    gpu: product.gpu,
    npuTops: product.npuTops,
    ramGb: product.ramGb,
    ramUpgradeable: product.ramUpgradeable,
    storageGb: product.storageGb,
    storageSlotCount: product.storageSlotCount,
    displayInch: product.displayInch,
    displayResolution: product.displayResolution,
    displayRefreshHz: product.displayRefreshHz,
    displayBrightnessNit: product.displayBrightnessNit,
    weightKg: product.weightKg,
    os: product.os,
    batteryWh: product.batteryWh,
    batteryMaxHours: product.batteryMaxHours,
    power: product.power,
    useCases: product.useCases,
    tags: product.productTags.map((productTag) => productTag.tag.name),
    description: product.description,
    rawSpec: product.rawSpec,
    collectedAt: product.collectedAt,
  };
}

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      productTags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  return products.map(mapProduct);
}

export async function getProductByPcode(pcode: string) {
  const product = await prisma.product.findUnique({
    where: {
      pcode,
    },
    include: {
      productTags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return mapProduct(product);
}
