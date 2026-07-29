import { renderHook } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useSearchQuery } from './use-search-query.js';

describe('useSearchQuery', () => {
  const createWrapper = (initialEntries: string[]) => {
    return ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    );
  };

  it('should return URLSearchParams object', () => {
    const wrapper = createWrapper(['/test?foo=bar']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current).toBeInstanceOf(URLSearchParams);
  });

  it('should parse single query parameter correctly', () => {
    const wrapper = createWrapper(['/test?page=5']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.get('page')).toBe('5');
  });

  it('should parse multiple query parameters correctly', () => {
    const wrapper = createWrapper(['/test?page=5&sort=name&filter=active']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.get('page')).toBe('5');
    expect(result.current.get('sort')).toBe('name');
    expect(result.current.get('filter')).toBe('active');
  });

  it('should handle empty search string', () => {
    const wrapper = createWrapper(['/test']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.toString()).toBe('');
    expect(result.current.get('anything')).toBeNull();
  });

  it('should handle encoded characters', () => {
    const wrapper = createWrapper(['/test?name=John%20Doe&email=test%40example.com']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.get('name')).toBe('John Doe');
    expect(result.current.get('email')).toBe('test@example.com');
  });

  it('should handle array-like parameters', () => {
    const wrapper = createWrapper(['/test?tags=a&tags=b&tags=c']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.getAll('tags')).toEqual(['a', 'b', 'c']);
  });

  it('should return memoized value for same search string', () => {
    const wrapper = createWrapper(['/test?foo=bar']);
    const { result, rerender } = renderHook(() => useSearchQuery(), { wrapper });

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Same object reference due to useMemo
    expect(firstResult).toBe(secondResult);
  });

  it('should return new object when search changes', () => {
    let currentPath = '/test?foo=bar';
    const DynamicWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[currentPath]}>{children}</MemoryRouter>
    );

    const { result, rerender } = renderHook(() => useSearchQuery(), {
      wrapper: DynamicWrapper,
    });

    const firstResult = result.current;
    expect(firstResult.get('foo')).toBe('bar');

    // Change path and rerender with new wrapper
    currentPath = '/test?foo=baz';
    const NewWrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[currentPath]}>{children}</MemoryRouter>
    );

    const { result: newResult } = renderHook(() => useSearchQuery(), {
      wrapper: NewWrapper,
    });

    expect(newResult.current.get('foo')).toBe('baz');
  });

  it('should handle parameters with no value', () => {
    const wrapper = createWrapper(['/test?flag&enabled=true']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.has('flag')).toBe(true);
    expect(result.current.get('flag')).toBe('');
    expect(result.current.get('enabled')).toBe('true');
  });

  it('should handle special characters in values', () => {
    const wrapper = createWrapper(['/test?query=hello+world&symbol=%26']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.get('query')).toBe('hello world');
    expect(result.current.get('symbol')).toBe('&');
  });

  it('should return null for non-existent parameters', () => {
    const wrapper = createWrapper(['/test?foo=bar']);
    const { result } = renderHook(() => useSearchQuery(), { wrapper });

    expect(result.current.get('nonexistent')).toBeNull();
  });
});
