"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

import { redirect } from 'next/navigation';

async function requireAdmin() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    redirect('/login');
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    redirect('/dashboard');
  }

  return session.user;
}

export async function getDashboardStats() {
  await requireAdmin();

  const totalRevenueData = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: "COMPLETED" }
  });

  const totalSales = await prisma.order.count({
    where: { status: "COMPLETED" }
  });

  const totalUsers = await prisma.user.count();

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { title: true } } }
      }
    }
  });

  return {
    totalRevenue: totalRevenueData._sum.total || 0,
    totalSales,
    totalUsers,
    recentOrders
  };
}

export async function getAdminProducts() {
  await requireAdmin();
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createProduct(data: any) {
  await requireAdmin();
  
  // Basic slug generation from title
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        shortDescription: data.shortDescription,
        price: Number(data.price),
        category: data.category,
        difficulty: data.difficulty,
        hardwareUsed: data.hardwareUsed ? data.hardwareUsed.split(',').map((s: string) => s.trim()) : [],
        softwareUsed: data.softwareUsed ? data.softwareUsed.split(',').map((s: string) => s.trim()) : [],
        whatsIncluded: data.whatsIncluded ? data.whatsIncluded.split(',').map((s: string) => s.trim()) : [],
        images: data.images ? data.images.split(',').map((s: string) => s.trim()) : [],
        sourceCodePath: data.sourceCodePath || null,
        cadFilePath: data.cadFilePath || null,
        pdfDocPath: data.pdfDocPath || null,
      }
    });
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product. Check if the title is unique." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product." };
  }
}
