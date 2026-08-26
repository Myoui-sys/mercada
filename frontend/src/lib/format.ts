/**
 * Formata um valor numérico como moeda brasileira (R$ 1.234,56).
 * Centralizado aqui para manter a formatação de preço idêntica em toda
 * a aplicação (catálogo, carrinho, checkout, histórico de pedidos).
 */
export function formatPrice(value: number | string): string {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  return numericValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export function formatOrderStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}
