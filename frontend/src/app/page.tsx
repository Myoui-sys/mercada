import Link from 'next/link';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/product-card';
import type { Category, PaginatedProducts } from '@/types';

interface HomePageProps {
  searchParams: {
    search?: string;
    categoryId?: string;
    sortBy?: string;
    page?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set('search', searchParams.search);
  if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
  if (searchParams.sortBy) params.set('sortBy', searchParams.sortBy);
  params.set('page', searchParams.page ?? '1');
  params.set('limit', '12');

  const [productsResult, categories] = await Promise.all([
    api.get<PaginatedProducts>(`/products?${params.toString()}`),
    api.get<Category[]>('/categories'),
  ]);

  const hasFilters = Boolean(searchParams.search || searchParams.categoryId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterLink
          href="/"
          label="Todas as categorias"
          isActive={!searchParams.categoryId}
        />
        {categories.map((category) => (
          <FilterLink
            key={category.id}
            href={`/?categoryId=${category.id}`}
            label={category.name}
            isActive={searchParams.categoryId === category.id}
          />
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold">
          {searchParams.search
            ? `Resultados para "${searchParams.search}"`
            : 'Ofertas do dia'}
        </h1>

        <SortSelect currentSort={searchParams.sortBy} searchParams={searchParams} />
      </div>

      {productsResult.data.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border p-8 text-center text-muted">
          Nenhum produto encontrado{hasFilters ? ' para esse filtro' : ''}.{' '}
          {hasFilters && (
            <Link href="/" className="underline hover:text-ink">
              Limpar filtros
            </Link>
          )}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {productsResult.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={productsResult.page}
            totalPages={productsResult.totalPages}
            searchParams={searchParams}
          />
        </>
      )}
    </div>
  );
}

function FilterLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-sm transition ${
        isActive
          ? 'border-ink bg-ink text-white'
          : 'border-border text-muted hover:border-ink hover:text-ink'
      }`}
    >
      {label}
    </Link>
  );
}

function SortSelect({
  currentSort,
  searchParams,
}: {
  currentSort?: string;
  searchParams: HomePageProps['searchParams'];
}) {
  const options = [
    { value: 'newest', label: 'Mais recentes' },
    { value: 'price_asc', label: 'Menor preço' },
    { value: 'price_desc', label: 'Maior preço' },
  ];

  function buildHref(sortBy: string) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
    params.set('sortBy', sortBy);
    return `/?${params.toString()}`;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted">Ordenar por:</span>
      <div className="flex gap-1">
        {options.map((option) => (
          <Link
            key={option.value}
            href={buildHref(option.value)}
            className={`rounded-sm px-2 py-1 ${
              currentSort === option.value ||
              (!currentSort && option.value === 'newest')
                ? 'bg-ink text-white'
                : 'text-muted hover:text-ink'
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  searchParams: HomePageProps['searchParams'];
}) {
  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.categoryId) params.set('categoryId', searchParams.categoryId);
    if (searchParams.sortBy) params.set('sortBy', searchParams.sortBy);
    params.set('page', String(page));
    return `/?${params.toString()}`;
  }

  return (
    <nav className="mt-8 flex justify-center gap-2" aria-label="Paginação">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-sm border text-sm ${
            page === currentPage
              ? 'border-ink bg-ink text-white'
              : 'border-border text-muted hover:border-ink hover:text-ink'
          }`}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}
