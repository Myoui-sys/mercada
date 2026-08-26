interface StockBadgeProps {
  quantity: number;
}

/**
 * Sinaliza o estado do estoque com uma leitura rápida — inclui o caso de
 * borda de estoque zerado, que é usado de propósito no seed de dados para
 * exercitar esse fluxo nos testes.
 */
export function StockBadge({ quantity }: StockBadgeProps) {
  if (quantity <= 0) {
    return <span className="text-sm font-medium text-danger">Fora de estoque</span>;
  }

  if (quantity <= 5) {
    return (
      <span className="text-sm font-medium text-accent-dark">
        Últimas {quantity} unidades
      </span>
    );
  }

  return <span className="text-sm font-medium text-success">Em estoque</span>;
}
