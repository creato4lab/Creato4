import "dotenv/config";
import prisma from "../src/lib/prisma";

async function main() {
  const products = await (prisma as any).product.findMany({
    select: { id: true, title: true, images: true },
  });
  console.log("Products with images:");
  for (const p of products) {
    console.log(`  [${p.title}] images:`, p.images);
  }
}
main().catch(console.error);
