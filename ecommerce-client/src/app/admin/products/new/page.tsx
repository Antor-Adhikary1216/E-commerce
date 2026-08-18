"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X } from "lucide-react";
import { apiClient } from "@/services/api-client";
import { toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [brand, setBrand] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sku, setSku] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [tags, setTags] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [flashSale, setFlashSale] = useState(false);
  const [newArrival, setNewArrival] = useState(false);

  useEffect(() => {
    apiClient
      .get("/admin/products?limit=1")
      .then(() => {})
      .catch(() => {});
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data } = await apiClient.get(
        "/admin/products?limit=200"
      );
      const cats: Category[] = [];
      const seen = new Set<string>();
      for (const p of data.products || []) {
        if (p.category && !seen.has(p.category._id)) {
          seen.add(p.category._id);
          cats.push(p.category);
        }
      }
      setCategories(cats);
    } catch {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        const data = await res.json();
        setCategories(data.items || []);
      } catch {
        // ignore
      }
    }
  }

  function addImage() {
    const url = imageInput.trim();
    if (!url) return;
    if (images.includes(url)) {
      toast.error("Image URL already added");
      return;
    }
    setImages((prev) => [...prev, url]);
    setImageInput("");
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const priceNum = parseFloat(price) || 0;
  const discountNum = parseFloat(discount) || 0;
  const finalPrice = Math.round(priceNum * (1 - discountNum / 100));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return toast.error("Product name is required");
    if (!priceNum || priceNum <= 0) return toast.error("Valid price is required");
    if (!categoryId) return toast.error("Category is required");
    if (!sku.trim()) return toast.error("SKU is required");
    if (!brand.trim()) return toast.error("Brand is required");
    if (images.length === 0) return toast.error("At least one image URL is required");

    setSubmitting(true);
    try {
      await apiClient.post("/admin/products", {
        name: name.trim(),
        slug: slug || slugify(name),
        description: description.trim() || `A carefully selected ${name.trim()} designed for daily use.`,
        shortDescription: shortDescription.trim() || `Premium ${name.trim()} from ${brand.trim()}.`,
        price: priceNum,
        discount: discountNum,
        finalPrice,
        brand: brand.trim(),
        category: categoryId,
        sku: sku.trim(),
        images,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        colors: colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        sizes: sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        featured,
        bestSeller,
        flashSale,
        newArrival,
      });
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-[#8c8c8c] transition hover:text-[#262626]"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <h1 className="text-[20px] font-semibold text-[#262626]">
        Add New Product
      </h1>
      <p className="mt-1 text-[13px] text-[#8c8c8c]">
        Fill in the details below to create a new product
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Basic Info */}
        <section className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[#262626]">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Product Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="e.g. Apple iPhone 16 Pro"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Slug (auto-generated if empty)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="auto-generated-from-name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                  Brand *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                  placeholder="e.g. Apple"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                  SKU *
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                  placeholder="e.g. VNT-0144"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] bg-white px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Short Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="Brief product description"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Full Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[#f0f0f0] px-3 py-2 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="Detailed product description"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[#262626]">
            Pricing
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Discount (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Final Price (₹)
              </label>
              <div className="flex h-10 items-center rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-3 text-[13px] font-medium text-[#16815d]">
                ₹{finalPrice.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[#262626]">
            Images *
          </h2>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImage();
                }
              }}
              className="h-10 flex-1 rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
              placeholder="Paste image URL and press Enter"
            />
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-2 rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-4 text-[13px] font-medium text-[#262626] transition hover:bg-[#f5f5f5]"
            >
              <Upload size={14} />
              Add
            </button>
          </div>
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div
                  key={i}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg border border-[#f0f0f0]"
                >
                  <img
                    src={url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Variants */}
        <section className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[#262626]">
            Variants
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Colors (comma-separated)
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="e.g. Black, White, Silver"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="e.g. S, M, L, XL"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-medium text-[#8c8c8c]">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#f0f0f0] px-3 text-[13px] text-[#262626] focus:border-[#1677ff] focus:outline-none"
                placeholder="e.g. Electronics, Mobile, Apple"
              />
            </div>
          </div>
        </section>

        {/* Flags */}
        <section className="rounded-lg border border-[#f0f0f0] bg-white p-5">
          <h2 className="mb-4 text-[14px] font-semibold text-[#262626]">
            Visibility
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Featured", state: featured, set: setFeatured },
              { label: "Best Seller", state: bestSeller, set: setBestSeller },
              { label: "Flash Sale", state: flashSale, set: setFlashSale },
              { label: "New Arrival", state: newArrival, set: setNewArrival },
            ].map((flag) => (
              <label
                key={flag.label}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#f0f0f0] p-3 transition hover:bg-[#fafafb]"
              >
                <input
                  type="checkbox"
                  checked={flag.state}
                  onChange={(e) => flag.set(e.target.checked)}
                  className="h-4 w-4 rounded border-[#d9d9d9] text-[#1677ff] focus:ring-[#1677ff]"
                />
                <span className="text-[13px] font-medium text-[#262626]">
                  {flag.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-[#f0f0f0] bg-[#fafafb] px-5 py-2.5 text-[13px] font-medium text-[#262626] transition hover:bg-[#f5f5f5]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-[#1677ff] px-6 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#146ae0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
