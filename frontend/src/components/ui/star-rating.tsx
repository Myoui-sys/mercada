interface StarRatingProps {
  rating: number;
  count?: number;
}

export function StarRating({ rating, count }: StarRatingProps) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1 text-sm">
      <span aria-hidden className="text-accent-dark">
        {'★'.repeat(rounded)}
        {'☆'.repeat(5 - rounded)}
      </span>
      <span className="sr-only">{rating.toFixed(1)} de 5 estrelas</span>
      {typeof count === 'number' && (
        <span className="text-muted">({count})</span>
      )}
    </div>
  );
}
