import React from 'react';
import { getAdminProducts } from '@/actions/admin';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Tag, BookOpen, Package } from 'lucide-react';
import { DeleteProductButton } from './DeleteProductButton';

export const metadata = { title: "Manage Products - Creato4 Admin" };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1A3C2F] tracking-tight mb-2">Products Catalog</h1>
          <p className="text-[#1A3C2F]/60 font-medium">Manage your digital assets, blueprints, and courses.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#1A3C2F] text-[#FAF8F5] px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#1A3C2F]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#1A3C2F]/5 text-xs uppercase tracking-wider text-[#1A3C2F]/50 font-bold">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Difficulty</th>
                <th className="px-6 py-4">Base Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1A3C2F]/5 text-[#1A3C2F]/20 mb-4">
                      <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A3C2F] mb-1">No products yet</h3>
                    <p className="text-sm text-[#1A3C2F]/50">Start building your engineering catalog.</p>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} className="border-b border-[#1A3C2F]/5 hover:bg-[#FAF8F5]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#1A3C2F]/10 flex items-center justify-center shrink-0 overflow-hidden">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-[#1A3C2F]/20" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#1A3C2F] text-sm group-hover:text-[#C4A35A] transition-colors line-clamp-1">{product.title}</div>
                          <div className="text-xs font-mono text-[#1A3C2F]/40 mt-1 line-clamp-1">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#1A3C2F]/5 text-[#1A3C2F] px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider border border-[#1A3C2F]/10 whitespace-nowrap">
                        <Tag className="w-3 h-3" /> {product.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-[#C4A35A]/10 text-[#9A7D40] px-2.5 py-1 rounded-md text-[0.65rem] font-bold uppercase tracking-wider whitespace-nowrap">
                        <BookOpen className="w-3 h-3" /> {product.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#1A3C2F]">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
