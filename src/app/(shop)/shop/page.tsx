import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/actions/product';
import { ProductCategory, Difficulty } from '@/generated/prisma/client';
import { Search, Filter, Cpu, Code, BookOpen, Layers } from 'lucide-react';

export const metadata = {
  title: 'Engineering Products Catalog — Creato4 Lab',
  description: 'Browse our collection of engineering blueprints, source code, PCB designs, and CAD models.',
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const categoryParam = searchParams.category as ProductCategory | undefined;
  const difficultyParam = searchParams.difficulty as Difficulty | undefined;
  const searchParam = searchParams.search as string | undefined;

  const { products, error } = await getProducts({
    category: categoryParam,
    difficulty: difficultyParam,
    search: searchParam,
  });

  const categories = Object.values(ProductCategory);
  const difficulties = Object.values(Difficulty);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'ARDUINO':
      case 'ESP32':
      case 'STM32':
      case 'RASPBERRY_PI':
        return <Cpu className="w-4 h-4" />;
      case 'EMBEDDED_CODE':
        return <Code className="w-4 h-4" />;
      case 'COURSE':
        return <BookOpen className="w-4 h-4" />;
      case 'PCB_DESIGN':
      case 'CAD_MODEL':
        return <Layers className="w-4 h-4" />;
      default:
        return <Cpu className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Header section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-full px-3 py-1.5 text-[#1A3C2F] text-xs font-mono tracking-widest uppercase mb-4">
            Digital Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1A3C2F] tracking-tight mb-4">
            Engineering Blueprints
          </h1>
          <p className="text-[#1A3C2F]/70 max-w-2xl text-lg">
            Production-ready source code, PCB schematics, and mechanical CAD models for your next embedded project.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-32 space-y-8">
              
              {/* Search */}
              <div>
                <form action="/shop" method="GET" className="relative">
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchParam}
                    placeholder="Search products..."
                    className="w-full bg-[#1A3C2F]/5 border border-[#1A3C2F]/10 rounded-xl py-3 pl-10 pr-4 text-sm text-[#1A3C2F] placeholder:text-[#1A3C2F]/40 focus:outline-none focus:ring-2 focus:ring-[#C4A35A]/50 transition-shadow"
                  />
                  <Search className="w-4 h-4 text-[#1A3C2F]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  {categoryParam && <input type="hidden" name="category" value={categoryParam} />}
                  {difficultyParam && <input type="hidden" name="difficulty" value={difficultyParam} />}
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A3C2F]/50 mb-4 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <Link 
                    href={`/shop?${new URLSearchParams({ ...(difficultyParam && { difficulty: difficultyParam }), ...(searchParam && { search: searchParam }) }).toString()}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      !categoryParam ? 'bg-[#1A3C2F] text-[#FAF8F5] font-semibold' : 'text-[#1A3C2F]/70 hover:bg-[#1A3C2F]/5'
                    }`}
                  >
                    All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop?category=${cat}${difficultyParam ? `&difficulty=${difficultyParam}` : ''}${searchParam ? `&search=${searchParam}` : ''}`}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryParam === cat ? 'bg-[#1A3C2F] text-[#FAF8F5] font-semibold' : 'text-[#1A3C2F]/70 hover:bg-[#1A3C2F]/5'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      {cat.replace('_', ' ')}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A3C2F]/50 mb-4">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((diff) => (
                    <Link
                      key={diff}
                      href={`/shop?${categoryParam ? `category=${categoryParam}&` : ''}difficulty=${diff}${searchParam ? `&search=${searchParam}` : ''}`}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        difficultyParam === diff 
                          ? 'bg-[#C4A35A] text-[#1A3C2F]' 
                          : 'bg-[#1A3C2F]/5 text-[#1A3C2F]/60 hover:bg-[#1A3C2F]/10'
                      }`}
                    >
                      {diff}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm mb-6">
                {error}
              </div>
            )}
            
            {products.length === 0 ? (
              <div className="text-center py-24 bg-[#1A3C2F]/5 rounded-3xl border border-[#1A3C2F]/10 border-dashed">
                <Search className="w-8 h-8 text-[#1A3C2F]/30 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A3C2F] mb-2">No products found</h3>
                <p className="text-[#1A3C2F]/60 text-sm">Try adjusting your filters or search query.</p>
                <Link href="/shop" className="inline-block mt-6 px-6 py-2 bg-[#1A3C2F] text-[#FAF8F5] rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/shop/${product.slug}`}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#1A3C2F]/5 hover:border-[#C4A35A]/50 hover:shadow-2xl hover:shadow-[#C4A35A]/10 transition-all duration-300"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="aspect-[4/3] bg-[#1A3C2F]/5 relative overflow-hidden p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-start z-10">
                        <span className="bg-[#FAF8F5] text-[#1A3C2F] text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                          {product.category.replace('_', ' ')}
                        </span>
                        <span className={`text-[0.65rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm ${
                          product.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                          product.difficulty === 'INTERMEDIATE' ? 'bg-blue-100 text-blue-700' :
                          product.difficulty === 'ADVANCED' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.difficulty}
                        </span>
                      </div>
                      
                      {/* Decorative elements representing the product */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-700">
                        {getCategoryIcon(product.category)}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#1A3C2F] leading-tight mb-2 group-hover:text-[#C4A35A] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-sm text-[#1A3C2F]/60 line-clamp-2 mb-6 flex-1">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1A3C2F]/5">
                        <span className="text-xl font-black text-[#1A3C2F]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#C4A35A] opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
