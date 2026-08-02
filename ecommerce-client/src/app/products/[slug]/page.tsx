import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { fetchProduct } from "@/lib/catalog";
import { currency } from "@/lib/utils";
import { ProductActions } from "@/components/product-actions";
import { Reveal } from "@/components/motion/reveal";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  const discountPercent = product.discount > 0 ? Math.round((1 - product.finalPrice / product.price) * 100) : 0;
  const categorySlug = typeof product.category === "object" ? product.category.slug : undefined;

  return (
    <main className="mx-auto max-w-[1240px] px-3 py-6">
      <nav className="flex items-center gap-1.5 overflow-x-auto px-2 text-[12px] text-slate-500">
        <Link href="/" className="hover:text-[#16815d]">Home</Link>
        <ChevronRight size={13} />
        <Link href="/shop" className="hover:text-[#16815d]">Shop</Link>
        {categorySlug && (
          <>
            <ChevronRight size={13} />
            <Link href={`/shop?category=${encodeURIComponent(categorySlug)}`} className="hover:text-[#16815d]">{product.category.name}</Link>
          </>
        )}
        <ChevronRight size={13} />
        <span className="truncate text-[#1c2734]">{product.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Reveal className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,.12)]" y={24}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-contain p-6"
            priority
          />
        </Reveal>

        <Reveal className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,.12)] md:p-8" delay={0.1}>
          {product.bestSeller && <span className="rounded-full bg-[#1c2734] px-2.5 py-1 text-[11px] font-semibold text-white">Best seller</span>}
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">{product.name}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{product.brand}</p>

          <div className="mt-3 flex items-center gap-2 text-[13px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e5ead9] px-2 py-1 font-semibold text-[#16815d]">
              {product.rating} <Star size={11} fill="currentColor" />
            </span>
            <span className="text-slate-500">{product.reviewCount} ratings</span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-3xl font-black">{currency(product.finalPrice)}</span>
            {discountPercent > 0 && (
              <>
                <del className="text-sm text-slate-400">{currency(product.price)}</del>
                <span className="rounded-full bg-[#d8ef72] px-2 py-0.5 text-[11px] font-bold text-[#1c2734]">{discountPercent}% off</span>
              </>
            )}
          </div>
          {discountPercent > 0 && <p className="mt-1 text-[12px] text-slate-500">MRP inclusive of all taxes</p>}

          <p className="mt-5 text-[13px] leading-6 text-slate-600">{product.description}</p>

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="rounded-full border border-slate-200 px-4 py-1.5 text-[13px] font-medium">{size}</span>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-slate-500">Colour</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="rounded-full border border-slate-200 px-4 py-1.5 text-[13px] font-medium">{color}</span>
                ))}
              </div>
            </div>
          )}

          <ProductActions product={product} />

          <div className="mt-6 grid gap-2 border-t border-slate-100 pt-5 text-[12px] text-slate-500 sm:grid-cols-3">
            <span className="flex items-center gap-1.5"><Truck size={15} /> Free delivery</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={15} /> 7-day returns</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} /> Secure checkout</span>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
