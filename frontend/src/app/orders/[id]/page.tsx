'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatOrderStatus, formatPrice } from '@/lib/format';
import type { Order } from '@/types';

/**
 * Recibo do pedido.
 *
 * É o elemento de assinatura visual do sistema: bordas pontilhadas e
 * tipografia monoespaçada para os valores, remetendo a uma nota fiscal
 * real em vez de mais um "card de detalhe" genérico.
 */
export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    api
      .get<Order>(`/orders/${params.id}`, token)
      .then(setOrder)
      .catch(() => setError('Não foi possível carregar este pedido.'));
  }, [token, params.id]);

  if (error) {
    return <p className="mx-auto max-w-xl px-4 py-16 text-center text-danger">{error}</p>;
  }

  if (!order) {
    return <p className="mx-auto max-w-xl px-4 py-16 text-center text-muted">Carregando pedido...</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="rounded-sm border border-border bg-surface p-6 font-mono text-sm">
        <div className="text-center">
          <p className="font-display text-lg font-semibold not-italic">mercatta</p>
          <p className="text-xs text-muted">Comprovante de pedido</p>
        </div>

        <div className="receipt-divider my-4" />

        <div className="flex justify-between text-xs text-muted">
          <span>Pedido</span>
          <span>#{order.id.slice(0, 8)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Data</span>
          <span>{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Status</span>
          <span>{formatOrderStatus(order.status)}</span>
        </div>

        <div className="receipt-divider my-4" />

        <ul className="flex flex-col gap-2">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.quantity}x {item.product.name}
              </span>
              <span>{formatPrice(Number(item.unitPriceAtPurchase) * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="receipt-divider my-4" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>

        <div className="receipt-divider my-4" />

        <div>
          <p className="text-xs text-muted">Endereço de entrega</p>
          <p>{order.shippingAddress}</p>
        </div>
      </div>
    </div>
  );
}
