"use client";
import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { apiClient } from "@/services/api-client";
import { currency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  finalPrice: number;
  stock?: number;
  sku: string;
  brand: string;
  category: { _id: string; name: string };
  images: string[];
  featured: boolean;
  bestSeller: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/admin/products?limit=50");
      setProducts(data.products || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      await apiClient.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch {
      // ignore
    } finally {
      setDeleting(false);
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-7 w-48" />
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg border border-[#f0f0f0] bg-white p-4">
              <Skeleton className="h-12 w-12 shrink-0 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[#262626]">Products</h1>
          <p className="mt-1 text-[13px] text-[#8c8c8c]">Manage your product inventory</p>
        </div>
      </div>

      {/* Search */}
      <div className="mt-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c8c8c]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, SKU, or brand..."
            className="h-10 w-full rounded-lg border border-[#f0f0f0] bg-white pl-10 pr-4 text-[13px] text-[#262626] placeholder:text-[#8c8c8c] focus:border-[#1677ff] focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c8c8c] hover:text-[#262626]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="mt-4 overflow-hidden rounded-lg border border-[#f0f0f0] bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0f0f0] bg-[#fafafb]">
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Product</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">SKU</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Price</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Category</th>
              <th className="px-4 py-3 text-left text-[12px] font-medium text-[#8c8c8c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafb]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <img src={product.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                    )}
                    <div>
                      <p className="text-[13px] font-medium text-[#262626]">{product.name}</p>
                      <p className="text-[11px] text-[#8c8c8c]">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">{product.sku}</td>
                <td className="px-4 py-3 text-[13px] text-[#262626]">{currency(product.finalPrice)}</td>
                <td className="px-4 py-3 text-[12px] text-[#8c8c8c]">{product.category?.name || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded p-1.5 text-[#8c8c8c] hover:bg-[#f5f5f5] hover:text-[#1677ff]">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product._id)}
                      className="rounded p-1.5 text-[#8c8c8c] hover:bg-[#fff2f0] hover:text-[#cf1322]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[13px] text-[#8c8c8c]">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h3 className="text-[16px] font-semibold text-[#262626]">Delete Product</h3>
            <p className="mt-2 text-[14px] text-[#8c8c8c]">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-4 py-2 text-[14px] font-medium text-[#262626] hover:bg-[#f5f5f5]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="rounded-lg bg-[#ff3b30] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#ff453a] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
