'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { api, ApiRequestError } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

export default function CheckoutPage() {
  const { user, token } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState(
    user?.shippingAddress ?? '',
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Entre para finalizar sua compra
        </h1>
        <Link href="/login" className="mt-4 inline-block">
          <Button>Entrar</Button>
        </Link>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Seu carrinho está vazio.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.post<Order>(
        '/orders/checkout',
        shippingAddress ? { shippingAddress } : {},
        token,
      );
      await refreshCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível finalizar o pedido.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">
        Finalizar compra
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <div className="rounded-sm border border-border p-4">
          <h2 className="font-medium">Endereço de entrega</h2>
          <textarea
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            placeholder="Rua, número, bairro, cidade/UF"
            rows={3}
            className="mt-2 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        <div className="rounded-sm border border-border p-4">
          <h2 className="mb-3 font-medium">Resumo do pedido</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.quantity}x {item.product.name}
                </span>
                <span className="price-tag">
                  {formatPrice(Number(item.product.price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="receipt-divider my-3" />

          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="price-tag text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSubmitting} disabled={items.length === 0}>
          Confirmar pedido
        </Button>
      </form>
    </div>
  );
}
