"use server";

import prisma from "@/lib/prisma";
import { ProductCategory, Difficulty } from "../generated/prisma/client";

export async function getProducts(filters?: {
  category?: ProductCategory;
  difficulty?: Difficulty;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.difficulty) {
      where.difficulty = filters.difficulty;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
