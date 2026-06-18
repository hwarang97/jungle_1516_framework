import "dotenv/config";

import products from "../data/products.json";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

type SeedProduct = {
  pcode: string;
  name: string;
  brand: string;
  priceKrw: number;
  imageUrl: string;
  productUrl: string;
  source: string;
  category: string;
  cpu: string;
  cpuBrand?: string | null;
  gpu: string;
  gpuType?: string | null;
  npuTops?: number | null;
  ramGb: number;
  ramUpgradeable?: boolean | null;
  storageGb: number;
  storageSlotCount?: number | null;
  displayInch: number;
  displayCm?: number | null;
  displayResolution?: string | null;
  displayRefreshHz?: number | null;
  displayBrightnessNit?: number | null;
  weightKg: number;
  os: string;
  batteryWh?: number | null;
  batteryMaxHours?: number | null;
  power?: string | null;
  ports?: string[];
  useCases?: string[];
  tags?: string[];
  description: string;
  rawSpec: string;
  collectedAt?: string | null;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedProduct(product: SeedProduct) {
  const savedProduct = await prisma.product.upsert({
    where: { pcode: product.pcode },
    update: {
      name: product.name,
      brand: product.brand,
      priceKrw: product.priceKrw,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      source: product.source,
      category: product.category,
      cpu: product.cpu,
      cpuBrand: product.cpuBrand ?? null,
      gpu: product.gpu,
      gpuType: product.gpuType ?? null,
      npuTops: product.npuTops ?? null,
      ramGb: product.ramGb,
      ramUpgradeable: product.ramUpgradeable ?? null,
      storageGb: product.storageGb,
      storageSlotCount: product.storageSlotCount ?? null,
      displayInch: product.displayInch,
      displayCm: product.displayCm ?? null,
      displayResolution: product.displayResolution ?? null,
      displayRefreshHz: product.displayRefreshHz ?? null,
      displayBrightnessNit: product.displayBrightnessNit ?? null,
      weightKg: product.weightKg,
      os: product.os,
      batteryWh: product.batteryWh ?? null,
      batteryMaxHours: product.batteryMaxHours ?? null,
      power: product.power ?? null,
      ports: product.ports ?? [],
      useCases: product.useCases ?? [],
      description: product.description,
      rawSpec: product.rawSpec,
      collectedAt: product.collectedAt ?? null,
    },
    create: {
      pcode: product.pcode,
      name: product.name,
      brand: product.brand,
      priceKrw: product.priceKrw,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      source: product.source,
      category: product.category,
      cpu: product.cpu,
      cpuBrand: product.cpuBrand ?? null,
      gpu: product.gpu,
      gpuType: product.gpuType ?? null,
      npuTops: product.npuTops ?? null,
      ramGb: product.ramGb,
      ramUpgradeable: product.ramUpgradeable ?? null,
      storageGb: product.storageGb,
      storageSlotCount: product.storageSlotCount ?? null,
      displayInch: product.displayInch,
      displayCm: product.displayCm ?? null,
      displayResolution: product.displayResolution ?? null,
      displayRefreshHz: product.displayRefreshHz ?? null,
      displayBrightnessNit: product.displayBrightnessNit ?? null,
      weightKg: product.weightKg,
      os: product.os,
      batteryWh: product.batteryWh ?? null,
      batteryMaxHours: product.batteryMaxHours ?? null,
      power: product.power ?? null,
      ports: product.ports ?? [],
      useCases: product.useCases ?? [],
      description: product.description,
      rawSpec: product.rawSpec,
      collectedAt: product.collectedAt ?? null,
    },
  });

  await prisma.productTag.deleteMany({
    where: { productId: savedProduct.id },
  });

  for (const tagName of product.tags ?? []) {
    const tag = await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });

    await prisma.productTag.create({
      data: {
        productId: savedProduct.id,
        tagId: tag.id,
      },
    });
  }
}

async function main() {
  const seedProducts = products as SeedProduct[];

  for (const product of seedProducts) {
    await seedProduct(product);
  }

  console.log(`Seeded ${seedProducts.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
