'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { ApiRequestError } from '@/lib/api';

export default function CartPage() {
  const { user } = useAuth();
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Entre para ver seu carrinho
        </h1>
        <p className="mt-2 text-muted">
          Você precisa estar logado para adicionar itens e finalizar uma compra.
        </p>
        <Link href="/login" className="mt-4 inline-block">
          <Button>Entrar</Button>
        </Link>
      </div>
    );
  }

  if (isLoading && !cart) {
    return <p className="px-4 py-16 text-center text-muted">Carregando carrinho...</p>;
  }

  const items = cart?.items ?? [];

  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  async function handleUpdate(itemId: string, quantity: number) {
    setError(null);
    try {
      if (quantity <= 0) {
        await removeItem(itemId);
      } else {
        await updateItem(itemId, quantity);
      }
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível atualizar o carrinho.',
      );
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">Seu carrinho</h1>

      {items.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-border p-8 text-center text-muted">
          Seu carrinho está vazio.{' '}
          <Link href="/" className="underline hover:text-ink">
            Continuar comprando
          </Link>
        </p>
      ) : (
        <div className="mt-6 rounded-sm border border-border bg-surface p-6">
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-canvas">
                  {item.product.imageUrl && (
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <span className="price-tag text-sm text-muted">
                    {formatPrice(item.product.price)} / unidade
                  </span>

                  <div className="mt-1 flex items-center gap-2">
                    <select
                      value={item.quantity}
                      onChange={(event) =>
                        handleUpdate(item.id, Number(event.target.value))
                      }
                      className="rounded-sm border border-border px-2 py-1 text-sm"
                    >
                      {Array.from(
                        { length: Math.min(item.product.stockQuantity, 10) || 1 },
                        (_, index) => index + 1,
                      ).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleUpdate(item.id, 0)}
                      className="text-sm text-danger hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>

                <span className="price-tag self-start text-sm font-medium">
                  {formatPrice(Number(item.product.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="receipt-divider my-4" />

          <div className="flex items-center justify-between">
            <span className="font-medium">Total</span>
            <span className="price-tag text-xl font-semibold">
              {formatPrice(total)}
            </span>
          </div>

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}

          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full">Finalizar compra</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
