export type Result<T, E> =
  | {ok: true, value: T}
  | {ok: false, error: E};

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value: value };
}
