import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/format';
import { StockBadge } from '@/components/ui/stock-badge';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-border bg-surface transition hover:border-ink"
    >
      <div className="relative aspect-square bg-canvas">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Sem imagem
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs uppercase tracking-wide text-muted">
          {product.brand}
        </span>
        <h3 className="line-clamp-2 text-sm font-medium text-ink">
          {product.name}
        </h3>
        <p className="price-tag mt-1 text-lg font-semibold text-ink">
          {formatPrice(product.price)}
        </p>
        <StockBadge quantity={product.stockQuantity} />
      </div>
    </Link>
  );
}
