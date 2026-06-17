"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSupportedProductImageUrl } from "@/lib/productImages";

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
    throw new Error(`${label} value is required.`);
  }

  return value;
}

function getRequiredNumber(formData: FormData, key: string, label: string) {
  const value = Number(getRequiredText(formData, key, label));

  if (!Number.isFinite(value)) {
    throw new Error(`${label} value must be a number.`);
  }

  return value;
}

function getRequiredImageUrl(formData: FormData) {
  const imageUrl = getRequiredText(formData, "imageUrl", "Product image URL");

  if (!isSupportedProductImageUrl(imageUrl)) {
    throw new Error("Product image URL must be a supported image URL.");
  }

  return imageUrl;
}

function getCreateProductCode(formData: FormData) {
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

function getProductFormData(formData: FormData, pcode: string) {
  const name = getRequiredText(formData, "name", "Product name");
  const brand = getRequiredText(formData, "brand", "Brand");
  const description = getText(formData, "description") || `${brand} ${name}`;
  const rawSpec = getText(formData, "rawSpec") || description;
  const tags = getTags(formData);

  return {
    product: {
      pcode,
      name,
      brand,
      priceKrw: Math.trunc(getRequiredNumber(formData, "priceKrw", "Price")),
      imageUrl: getRequiredImageUrl(formData),
      productUrl: getRequiredText(formData, "productUrl", "Original product URL"),
      cpu: getRequiredText(formData, "cpu", "CPU"),
      gpu: getRequiredText(formData, "gpu", "GPU"),
      ramGb: Math.trunc(getRequiredNumber(formData, "ramGb", "RAM")),
      storageGb: Math.trunc(getRequiredNumber(formData, "storageGb", "SSD")),
      displayInch: getRequiredNumber(formData, "displayInch", "Display size"),
      weightKg: getRequiredNumber(formData, "weightKg", "Weight"),
      os: getRequiredText(formData, "os", "OS"),
      description,
      rawSpec,
    },
    tags,
  };
}

function getTagCreateData(tags: string[]) {
  return tags.map((tagName) => ({
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
  }));
}

export async function createProduct(formData: FormData) {
  const pcode = getCreateProductCode(formData);
  const { product, tags } = getProductFormData(formData, pcode);

  await prisma.product.create({
    data: {
      ...product,
      productTags: {
        create: getTagCreateData(tags),
      },
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${pcode}`);
  redirect(`/products/${pcode}`);
}

export async function updateProduct(currentPcode: string, formData: FormData) {
  const nextPcode = getText(formData, "pcode") || currentPcode;
  const { product, tags } = getProductFormData(formData, nextPcode);

  await prisma.product.update({
    where: {
      pcode: currentPcode,
    },
    data: {
      ...product,
      productTags: {
        deleteMany: {},
        create: getTagCreateData(tags),
      },
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${currentPcode}`);
  revalidatePath(`/products/${nextPcode}`);
  redirect(`/products/${nextPcode}`);
}

export async function deleteProduct(pcode: string) {
  await prisma.product.deleteMany({
    where: {
      pcode,
    },
  });

  revalidatePath("/products");
  revalidatePath(`/products/${pcode}`);
  redirect("/products");
}

export async function createComment(productPcode: string, formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/login?next=/products/${productPcode}`);
  }

  const content = getRequiredText(formData, "content", "Comment");

  await prisma.comment.create({
    data: {
      content,
      author: {
        connect: {
          id: currentUser.id,
        },
      },
      product: {
        connect: {
          pcode: productPcode,
        },
      },
    },
  });

  revalidatePath(`/products/${productPcode}`);
}
