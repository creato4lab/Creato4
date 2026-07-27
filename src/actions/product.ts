"use server";

import prisma from "@/lib/prisma";
import { ProductCategory, Difficulty } from "../generated/prisma/client";

export async function getProducts(filters?: {
  category?: ProductCategory;
  difficulty?: Difficulty;
  search?: string;
  tags?: string;
  sort?: "newest" | "popular" | "price_asc" | "price_desc" | "rating";
}) {
  try {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.tags) {
      where.tags = { has: filters.tags };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { shortDescription: { contains: filters.search, mode: "insensitive" } },
        { tags: { has: filters.search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    switch (filters?.sort) {
      case "popular":
        orderBy = { downloadCount: "desc" };
        break;
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], error: "Failed to fetch products" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return { product: null, error: "Product not found" };
    }

    return { product, error: null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { product: null, error: "Failed to fetch product" };
  }
}

export async function getRelatedProducts(productId: string, category: ProductCategory, limit = 3) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        NOT: { id: productId },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching related products:", error);
    return { products: [], error: "Failed to fetch related products" };
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({ select: { tags: true } });
    const allTags = products.flatMap((p) => p.tags);
    return [...new Set(allTags)].sort();
  } catch {
    return [];
  }
}
