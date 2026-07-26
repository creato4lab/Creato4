"use client";

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    const result = await deleteProduct(id);
    
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors ${isDeleting ? 'opacity-50 cursor-wait' : ''}`}
      title="Delete Product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
