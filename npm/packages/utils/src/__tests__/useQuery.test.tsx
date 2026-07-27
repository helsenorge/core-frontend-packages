import type { ReactElement } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { type UseQueryOptions, useQuery } from '../useQuery';

interface TestHarnessProps {
  options: UseQueryOptions<string, [string]>;
  nextArgs?: [string];
}

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

const createDeferred = <T,>(): Deferred<T> => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const TestHarness = ({ options, nextArgs }: TestHarnessProps): ReactElement => {
  const query = useQuery(options);

  return (
    <>
      <span data-testid="status">{query.status}</span>
      <span data-testid="data">{query.data ?? ''}</span>
      <span data-testid="is-error">{String(query.isError)}</span>
      <button onClick={query.refetch}>{'Refetch'}</button>
      {nextArgs && <button onClick={() => query.fetchNext(nextArgs)}>{'Fetch next'}</button>}
    </>
  );
};

describe('Gitt at useQuery brukes', () => {
  it('Så hentes data automatisk og status blir success', async () => {
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => `resultat-${value}`);

    render(<TestHarness options={{ queryKey: ['auto'], queryFn, args: ['a'] }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    expect(screen.getByTestId('data')).toHaveTextContent('resultat-a');
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('Så kjøres ikke queryFn automatisk når enabled er false, men refetch virker', async () => {
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => `resultat-${value}`);

    render(<TestHarness options={{ queryKey: ['disabled'], queryFn, args: ['a'], enabled: false }} />);

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
    expect(queryFn).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Refetch' }));

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('Så merges data når fetchNext brukes med merge-funksjon', async () => {
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => value);

    render(
      <TestHarness
        options={{
          queryKey: ['merge'],
          queryFn,
          args: ['a'],
          merge: (oldData, newData) => `${oldData ?? ''}${newData}`,
        }}
        nextArgs={['b']}
      />
    );

    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('a'));

    fireEvent.click(screen.getByRole('button', { name: 'Fetch next' }));

    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('ab'));
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  it('Så settes error-status og onError kalles ved feil', async () => {
    const onError = vi.fn();
    const queryFn = vi.fn(async () => Promise.reject(new Error('Feilet')));

    render(<TestHarness options={{ queryKey: ['error'], queryFn, args: ['a'], onError }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
    expect(screen.getByTestId('is-error')).toHaveTextContent('true');
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('Så hoppes ny automatisk fetch over når cache er fresh', async () => {
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => `resultat-${value}`);
    const args: [string] = ['a'];
    const { rerender } = render(<TestHarness options={{ queryKey: ['fresh'], queryFn, args, staleTime: 10_000 }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    rerender(<TestHarness options={{ queryKey: ['fresh'], queryFn, args, staleTime: 10_000, onSuccess: vi.fn() }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('Så dedupliseres automatisk fetch når request allerede pågår', async () => {
    const deferred = createDeferred<string>();
    const queryFn = vi.fn(async () => deferred.promise);
    const args: [string] = ['a'];
    const { rerender } = render(<TestHarness options={{ queryKey: ['dedupe'], queryFn, args }} />);

    rerender(<TestHarness options={{ queryKey: ['dedupe'], queryFn, args, onSuccess: vi.fn() }} />);

    expect(queryFn).toHaveBeenCalledTimes(1);

    deferred.resolve('resultat-a');
    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));
  });

  it('Så retrigger ikke automatisk fetch når feil er innenfor staleTime-vinduet', async () => {
    const queryFn = vi.fn(async () => Promise.reject(new Error('Feilet')));
    const args: [string] = ['a'];
    const { rerender } = render(<TestHarness options={{ queryKey: ['error-fresh'], queryFn, args, staleTime: 10_000 }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
    rerender(<TestHarness options={{ queryKey: ['error-fresh'], queryFn, args, staleTime: 10_000, onSuccess: vi.fn() }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('error'));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it('Så brukes placeholderData-funksjon mens første request laster', async () => {
    const deferred = createDeferred<string>();
    const queryFn = vi.fn(async () => deferred.promise);

    render(
      <TestHarness
        options={{
          queryKey: ['placeholder'],
          queryFn,
          args: ['a'],
          placeholderData: (prev, ctx) => `${prev ?? 'placeholder'}-${String(ctx.queryKey)}`,
        }}
      />
    );

    expect(screen.getByTestId('status')).toHaveTextContent('loading');
    expect(screen.getByTestId('data')).toHaveTextContent('placeholder-placeholder');

    deferred.resolve('resultat-a');
    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('resultat-a'));
  });

  it('Så ignoreres sen resolve fra gammel request når queryKey er endret', async () => {
    const deferredA = createDeferred<string>();
    const onSuccess = vi.fn();
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => {
      if (value === 'a') {
        return deferredA.promise;
      }
      return 'resultat-b';
    });

    const { rerender } = render(<TestHarness options={{ queryKey: ['stale', 'a'], queryFn, args: ['a'], onSuccess }} />);
    rerender(<TestHarness options={{ queryKey: ['stale', 'b'], queryFn, args: ['b'], onSuccess }} />);

    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('resultat-b'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenLastCalledWith('resultat-b');

    deferredA.resolve('resultat-a');
    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('resultat-b'));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('Så ignoreres sen reject fra gammel request når queryKey er endret', async () => {
    const deferredA = createDeferred<string>();
    const onError = vi.fn();
    const queryFn = vi.fn(async (_signal: AbortSignal, value: string) => {
      if (value === 'a') {
        return deferredA.promise;
      }
      return 'resultat-b';
    });

    const { rerender } = render(<TestHarness options={{ queryKey: ['stale-error', 'a'], queryFn, args: ['a'], onError }} />);
    rerender(<TestHarness options={{ queryKey: ['stale-error', 'b'], queryFn, args: ['b'], onError }} />);

    await waitFor(() => expect(screen.getByTestId('status')).toHaveTextContent('success'));

    deferredA.reject(new Error('For sen feil'));
    await waitFor(() => expect(screen.getByTestId('data')).toHaveTextContent('resultat-b'));
    expect(onError).not.toHaveBeenCalled();
  });
});
