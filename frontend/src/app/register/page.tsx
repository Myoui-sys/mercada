'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ApiRequestError } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ fullName, email, password, shippingAddress });
      router.push('/');
    } catch (err) {
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Não foi possível criar sua conta. Tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-2xl font-semibold">Criar conta</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="fullName" className="text-sm text-muted">
            Nome completo
          </label>
          <input
            id="fullName"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm text-muted">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm text-muted">
            Senha (mínimo 6 caracteres)
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="shippingAddress" className="text-sm text-muted">
            Endereço de entrega (opcional)
          </label>
          <input
            id="shippingAddress"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            className="mt-1 w-full rounded-sm border border-border p-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSubmitting}>
          Criar conta
        </Button>
      </form>

      <p className="mt-4 text-sm text-muted">
        Já tem conta?{' '}
        <Link href="/login" className="text-ink underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
