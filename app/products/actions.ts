"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getRequiredText(formData: FormData, key: string, label: string) {
  const value = getText(formData, key);

  if (!value) {
    throw new Error(`${label} 값이 필요합니다.`);
  }

  return value;
}

function getRequiredNumber(formData: FormData, key: string, label: string) {
  const value = Number(getRequiredText(formData, key, label));

  if (!Number.isFinite(value)) {
    throw new Error(`${label} 값은 숫자여야 합니다.`);
  }

  return value;
}

function getProductCode(formData: FormData) {
  const pcode = getText(formData, "pcode");

  if (pcode) {
    return pcode;
  }

  return `manual-${Date.now()}`;
}

function getTags(formData: FormData) {
  const tags = getText(formData, "tags")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return Array.from(new Set(tags));
}

export async function createProduct(formData: FormData) {
  const pcode = getProductCode(formData);
  const name = getRequiredText(formData, "name", "상품명");
  const brand = getRequiredText(formData, "brand", "브랜드");
  const description = getText(formData, "description") || `${brand} ${name}`;
  const rawSpec = getText(formData, "rawSpec") || description;
  const tags = getTags(formData);

  await prisma.product.create({
    data: {
      pcode,
      name,
      brand,
      priceKrw: Math.trunc(getRequiredNumber(formData, "priceKrw", "가격")),
      imageUrl: getRequiredText(formData, "imageUrl", "상품 이미지 URL"),
      productUrl: getRequiredText(formData, "productUrl", "원본 상품 URL"),
      cpu: getRequiredText(formData, "cpu", "CPU"),
      gpu: getRequiredText(formData, "gpu", "GPU"),
      ramGb: Math.trunc(getRequiredNumber(formData, "ramGb", "RAM")),
      storageGb: Math.trunc(getRequiredNumber(formData, "storageGb", "SSD")),
      displayInch: getRequiredNumber(formData, "displayInch", "화면 크기"),
      weightKg: getRequiredNumber(formData, "weightKg", "무게"),
      os: getRequiredText(formData, "os", "OS"),
      description,
      rawSpec,
      productTags: {
        create: tags.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: {
                name: tagName,
              },
              create: {
                name: tagName,
              },
            },
          },
        })),
      },
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${pcode}`);
  redirect(`/products/${pcode}`);
}
