export function numbersFromPrices(values: string[]) {
  return values.map((value) =>
    Number(value.replace(/[^\d,]/g, '').replace(',', '.')),
  );
}

export function isAscending(values: number[]) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}
