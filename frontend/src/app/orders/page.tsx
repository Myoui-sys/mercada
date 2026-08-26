'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { formatDate, formatOrderStatus, formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-muted',
  paid: 'text-success',
  shipped: 'text-accent-dark',
  delivered: 'text-success',
  cancelled: 'text-danger',
};

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!token) return;
    api.get<Order[]>('/orders', token).then(setOrders);
  }, [token]);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Entre para ver seus pedidos
        </h1>
        <Link href="/login" className="mt-4 inline-block">
          <Button>Entrar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold">Meus pedidos</h1>

      {!orders ? (
        <p className="mt-6 text-muted">Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-border p-8 text-center text-muted">
          Você ainda não fez nenhum pedido.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-sm border border-border p-4 hover:border-ink"
              >
                <div>
                  <p className="font-mono text-xs text-muted">
                    Pedido #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-muted">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span className={`text-sm font-medium ${STATUS_COLORS[order.status] ?? ''}`}>
                  {formatOrderStatus(order.status)}
                </span>

                <span className="price-tag font-semibold">
                  {formatPrice(order.totalAmount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
