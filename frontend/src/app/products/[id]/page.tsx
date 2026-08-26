import { notFound } from 'next/navigation';
import { api, ApiRequestError } from '@/lib/api';
import { ProductDetail } from '@/components/product/product-detail';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await api.get<Product>(`/products/${params.id}`);
    return <ProductDetail product={product} />;
  } catch (error) {
    if (error instanceof ApiRequestError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }
}
