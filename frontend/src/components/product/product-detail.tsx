'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { api, ApiRequestError } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { StockBadge } from '@/components/ui/stock-badge';
import { StarRating } from '@/components/ui/star-rating';
import type { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { user, token } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = product.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  async function handleAddToCart() {
    setError(null);
    setFeedback(null);

    if (!user) {
      router.push('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem(product.id, quantity);
      setFeedback('Produto adicionado ao carrinho.');
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível adicionar o produto ao carrinho.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-sm bg-canvas">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">
              Sem imagem
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm uppercase tracking-wide text-muted">
              {product.brand} · {product.category.name}
            </span>
            <h1 className="font-display text-3xl font-semibold text-ink">
              {product.name}
            </h1>
          </div>

          {reviews.length > 0 && (
            <StarRating rating={averageRating} count={reviews.length} />
          )}

          <p className="price-tag text-3xl font-semibold text-ink">
            {formatPrice(product.price)}
          </p>

          <StockBadge quantity={product.stockQuantity} />

          <p className="leading-relaxed text-muted">{product.description}</p>

          {product.stockQuantity > 0 && (
            <div className="flex items-center gap-3">
              <label htmlFor="quantity" className="text-sm text-muted">
                Quantidade
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
                className="rounded-sm border border-border px-2 py-1 text-sm"
              >
                {Array.from(
                  { length: Math.min(product.stockQuantity, 10) },
                  (_, index) => index + 1,
                ).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            isLoading={isSubmitting}
            disabled={product.stockQuantity === 0}
            className="w-full sm:w-auto"
          >
            {product.stockQuantity === 0
              ? 'Produto indisponível'
              : 'Adicionar ao carrinho'}
          </Button>

          {feedback && <p className="text-sm text-success">{feedback}</p>}
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      </div>

      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-display text-xl font-semibold">Avaliações</h2>

        {reviews.length === 0 ? (
          <p className="mt-3 text-muted">
            Este produto ainda não tem avaliações.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="rounded-sm border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.user.fullName}</span>
                  <span className="text-xs text-muted">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <StarRating rating={review.rating} />
                {review.comment && (
                  <p className="mt-2 text-sm text-muted">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}

        {user && <ReviewForm productId={product.id} token={token} />}
      </section>
    </div>
  );
}

function ReviewForm({
  productId,
  token,
}: {
  productId: string;
  token: string | null;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/reviews', { productId, rating, comment }, token);
      setComment('');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível enviar sua avaliação.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 rounded-sm border border-border p-4">
      <h3 className="font-medium">Deixe sua avaliação</h3>

      <div className="flex items-center gap-2">
        <label htmlFor="rating" className="text-sm text-muted">
          Nota
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          className="rounded-sm border border-border px-2 py-1 text-sm"
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} estrela{value > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Conte como foi sua experiência com o produto (opcional)"
        className="rounded-sm border border-border p-2 text-sm"
        rows={3}
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Enviar avaliação
      </Button>
    </form>
  );
}
