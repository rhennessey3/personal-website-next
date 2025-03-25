// This file is used to declare global types for testing

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> extends Function {
      new (...args: Y): T;
      (...args: Y): T;
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue(value: T): this;
      mockResolvedValueOnce(value: T): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      mockReturnThis(): this;
      mockName(name: string): this;
      getMockName(): string;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: Array<{ type: string; value: any }>;
      };
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
    }
  }
}

// Re-export to make the types available
export {};