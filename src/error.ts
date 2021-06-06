export interface Error {
  message: string;
}

export function isError(value: any): value is Error {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (value as Error).message !== undefined;
}
