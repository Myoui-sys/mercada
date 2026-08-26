'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <header className="border-b border-border bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
        <Link href="/" className="shrink-0 font-display text-2xl font-semibold tracking-tight">
          mercatta
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar produtos, marcas..."
            className="w-full rounded-l-sm border-0 px-3 py-2 text-sm text-ink outline-none"
            aria-label="Buscar produtos"
          />
          <button
            type="submit"
            className="rounded-r-sm bg-accent px-4 text-sm font-medium text-ink transition hover:bg-accent-dark"
          >
            Buscar
          </button>
        </form>

        <nav className="flex shrink-0 items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/orders" className="hover:text-accent">
                Meus pedidos
              </Link>
              <Link href="/profile" className="hover:text-accent">
                {user.fullName.split(' ')[0]}
              </Link>
              <button onClick={logout} className="hover:text-accent">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-accent">
                Entrar
              </Link>
              <Link href="/register" className="hover:text-accent">
                Criar conta
              </Link>
            </>
          )}

          <Link href="/cart" className="relative flex items-center gap-1 hover:text-accent">
            Carrinho
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-ink">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
