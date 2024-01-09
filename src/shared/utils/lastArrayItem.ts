export function lastArrayItem<T extends any[]>(arr: T): T[0] | undefined {
  if (arr.length === 0) return undefined;

  return arr[arr.length - 1];
}
