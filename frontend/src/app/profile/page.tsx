'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { api, ApiRequestError } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { AuthUser } from '@/types';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [shippingAddress, setShippingAddress] = useState(
    user?.shippingAddress ?? '',
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.get<AuthUser>('/users/me', token).then((profile) => {
      setFullName(profile.fullName);
      setShippingAddress(profile.shippingAddress ?? '');
    });
  }, [token]);

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Entre para ver seu perfil
        </h1>
        <Link href="/login" className="mt-4 inline-block">
          <Button>Entrar</Button>
        </Link>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFeedback(null);
    setIsSubmitting(true);

    try {
      await api.patch('/users/me', { fullName, shippingAddress }, token);
      setFeedback('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível atualizar seu perfil.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Meu perfil</h1>
      <p className="mt-1 text-sm text-muted">{user.email}</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="fullName" className="text-sm text-muted">
            Nome completo
          </label>
          <input
            id="fullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="shippingAddress" className="text-sm text-muted">
            Endereço de entrega
          </label>
          <input
            id="shippingAddress"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            placeholder="Rua, número, bairro, cidade/UF"
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        {feedback && <p className="text-sm text-success">{feedback}</p>}
        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSubmitting}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
