"use client";
import { motion } from "framer-motion";
import { ProductCard, type ProductCardData } from "@/components/product-card";
import { staggerContainer, staggerItem } from "@/components/motion/reveal";

export function ProductGrid({ cards, className }: { cards: ProductCardData[]; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(0.05)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
    >
      {cards.map((card) => (
        <motion.div key={card.slug} variants={staggerItem}>
          <ProductCard product={card} />
        </motion.div>
      ))}
    </motion.div>
  );
}
