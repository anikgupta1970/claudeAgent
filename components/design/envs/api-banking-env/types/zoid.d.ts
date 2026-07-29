declare module 'zoid/dist/zoid.frameworks' {
  const zoid: {
    create(options: Record<string, unknown>): (...args: unknown[]) => {
      render: (
        container: string | HTMLElement,
        context?: string
      ) => Promise<void>;
      close: () => Promise<void>;
      onError: (handler: (err: Error) => void) => void;
    };
  };
  export default zoid;
}
