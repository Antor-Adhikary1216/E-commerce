import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ProductCardData } from "@/components/product-card";
import { ProductGrid } from "@/components/motion/product-grid";
import { Reveal } from "@/components/motion/reveal";
import { fetchCatalog, toCard } from "@/lib/catalog";

const categories = [
  ["Mobiles", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=160&q=80"],
  ["Laptops", "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=160&q=80"],
  ["Headphones", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=160&q=80"],
  ["Sneakers", "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=160&q=80"],
  ["Furniture", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=160&q=80"],
  ["Grocery", "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80"],
  ["Books", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=160&q=80"],
  ["Toys", "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=160&q=80"],
];

function ProductRow({ title, subtitle, products }: { title: string; subtitle: string; products: ProductCardData[] }) {
  return (
    <section className="rounded-2xl bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
      <div className="flex items-center justify-between px-3 py-3">
        <div>
          <h2 className="text-[18px] font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <Link className="rounded-full bg-[#16815d] px-5 py-2 text-xs font-semibold text-white" href="/shop">
          VIEW ALL
        </Link>
      </div>
      <ProductGrid cards={products} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" />
    </section>
  );
}

export default async function Home() {
  const { items } = await fetchCatalog({ limit: 6, sort: "rating" });
  const products = items.map(toCard);

  return (
    <main className="mx-auto max-w-[1440px] space-y-5 py-5">
      <Reveal className="mx-3 rounded-2xl bg-white px-3 py-5 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
        <div className="mx-auto grid max-w-[1240px] grid-cols-4 gap-3 sm:grid-cols-8">
          {categories.map(([name, image]) => (
            <Link href={`/shop?category=${encodeURIComponent(name)}`} key={name} className="group flex min-w-0 flex-col items-center gap-2 text-center">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#e5ead9]">
                <Image fill sizes="56px" src={image} alt="" className="object-cover" />
              </div>
              <span className="line-clamp-2 text-xs font-semibold group-hover:text-[#16815d]">{name}</span>
            </Link>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-3 grid min-h-[310px] overflow-hidden rounded-2xl bg-[#d8ef72] text-[#1c2734] shadow-[0_1px_4px_rgba(0,0,0,.12)] md:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col justify-center px-7 py-8 md:px-14">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#16815d]">Weekend market</p>
          <h1 className="mt-3 text-4xl font-black leading-[.96] md:text-6xl">Good things. Better prices.</h1>
          <p className="mt-4 max-w-md text-[13px] leading-6 text-[#1c2734]/75">A less ordinary way to shop for the things you use every day.</p>
          <Link href="/sale" className="mt-7 inline-flex w-fit items-center gap-1 rounded-full bg-[#1c2734] px-5 py-3 text-xs font-semibold text-white">
            EXPLORE DEALS <ChevronRight size={15} />
          </Link>
        </div>
        <div className="relative min-h-[240px]">
          <Image priority src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=85" alt="Shopping offers" fill className="object-cover" />
        </div>
      </Reveal>

      <div className="mx-3">
        <Reveal>
          <ProductRow title="Today’s best finds" subtitle="Limited-time prices on the things people love" products={products} />
        </Reveal>
      </div>

      <Reveal className="mx-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-[#f3d8c4] p-7">
          <p className="text-xs font-semibold text-[#974d29]">Top offers</p>
          <h2 className="mt-2 text-2xl font-bold">Tech, without the noise</h2>
          <p className="mt-2 text-xs">Phones, laptops and audio worth taking home.</p>
          <Link href="/sale" className="mt-6 inline-block text-xs font-semibold text-[#16815d]">
            EXPLORE NOW
          </Link>
        </div>
        <div className="rounded-2xl bg-[#d9e7f2] p-7">
          <p className="text-xs font-semibold text-[#316481]">Home refresh</p>
          <h2 className="mt-2 text-2xl font-bold">Make space for easy</h2>
          <p className="mt-2 text-xs">Furniture and appliances for every room.</p>
          <Link href="/shop?category=Furniture" className="mt-6 inline-block text-xs font-semibold text-[#16815d]">
            SHOP HOME
          </Link>
        </div>
        <div className="rounded-2xl bg-[#e9dff4] p-7">
          <p className="text-xs font-semibold text-[#7f4598]">Style picks</p>
          <h2 className="mt-2 text-2xl font-bold">Wear what works</h2>
          <p className="mt-2 text-xs">Everyday fashion with a point of view.</p>
          <Link href="/shop?category=Sneakers" className="mt-6 inline-block text-xs font-semibold text-[#16815d]">
            SHOP FASHION
          </Link>
        </div>
      </Reveal>

      <div className="mx-3">
        <Reveal delay={0.1}>
          <ProductRow title="For your short list" subtitle="Popular products, exceptional value" products={[...products].reverse()} />
        </Reveal>
      </div>
    </main>
  );
}
