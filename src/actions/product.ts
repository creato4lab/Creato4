"use server";

import prisma from "@/lib/prisma";
import { ProductCategory, Difficulty } from "../generated/prisma/client";
import { STUDENT_PROJECTS } from "@/data";

function mapStudentProjectToProduct(sp: (typeof STUDENT_PROJECTS)[0]): any {
  const numericPrice = parseFloat(sp.price.replace(/[^0-9.]/g, '')) || 1999;
  
  let category: ProductCategory = ProductCategory.ARDUINO;
  if (sp.category === 'Hardware') {
    const titleLower = sp.title.toLowerCase();
    if (titleLower.includes('esp32')) category = ProductCategory.ESP32;
    else if (titleLower.includes('stm32')) category = ProductCategory.STM32;
    else if (titleLower.includes('raspberry')) category = ProductCategory.RASPBERRY_PI;
    else category = ProductCategory.ARDUINO;
  } else {
    category = ProductCategory.EMBEDDED_CODE;
  }

  let difficulty: Difficulty = Difficulty.BEGINNER;
  const diffUpper = sp.difficulty.toUpperCase();
  if (diffUpper === 'INTERMEDIATE') difficulty = Difficulty.INTERMEDIATE;
  if (diffUpper === 'ADVANCED') difficulty = Difficulty.ADVANCED;

  return {
    id: sp.id,
    title: sp.title,
    slug: sp.id,
    description: sp.description,
    shortDescription: sp.description,
    price: numericPrice,
    category,
    difficulty,
    hardwareUsed: sp.techStack || [],
    softwareUsed: sp.techStack || [],
    whatsIncluded: sp.includes || [],
    safetyWarning: "Follow ESD safety procedures and verify logic voltage limits before powering on hardware.",
    versionHistory: "v1.0 - Ready-to-Build Production Blueprint",
    sourceCodePath: null,
    cadFilePath: null,
    pdfDocPath: null,
    images: [sp.image],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

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

    let products: any[] = [];
    try {
      products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } catch (dbError) {
      console.warn("Database lookup failed, falling back to static project catalog:", dbError);
    }

    if (!products || products.length === 0) {
      const fallbackProducts = STUDENT_PROJECTS.map(mapStudentProjectToProduct);
      products = fallbackProducts.filter((p) => {
        if (filters?.category && p.category !== filters.category) return false;
        if (filters?.difficulty && p.difficulty !== filters.difficulty) return false;
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        }
        return true;
      });
    }

    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    const fallbackProducts = STUDENT_PROJECTS.map(mapStudentProjectToProduct);
    return { products: fallbackProducts, error: null };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    let product: any = null;
    try {
      product = await prisma.product.findUnique({
        where: { slug },
      });
    } catch (dbErr) {
      console.warn("Database slug lookup failed:", dbErr);
    }

    if (!product) {
      const sp = STUDENT_PROJECTS.find((p) => p.id === slug);
      if (sp) {
        product = mapStudentProjectToProduct(sp);
      }
    }

    if (!product) {
      return { product: null, error: "Product not found" };
    }

    return { product, error: null };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { product: null, error: "Failed to fetch product" };
  }
}
