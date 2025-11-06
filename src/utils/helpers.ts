/**
 * Functional utility library
 * Demonstrating advanced functional programming patterns
 */

/**
 * Compose functions right-to-left
 * compose(f, g, h)(x) === f(g(h(x)))
 */
export const compose = <T>(...fns: Array<(arg: T) => T>) => {
  return (initialValue: T): T => 
    fns.reduceRight((acc, fn) => fn(acc), initialValue);
};

/**
 * Pipe functions left-to-right (more intuitive for many developers)
 * pipe(f, g, h)(x) === h(g(f(x)))
 */
export const pipe = <T>(...fns: Array<(arg: T) => T>) => {
  return (initialValue: T): T => 
    fns.reduce((acc, fn) => fn(acc), initialValue);
};

/**
 * Curry a binary function
 * Useful for partial application patterns
 */
export const curry = <A, B, R>(fn: (a: A, b: B) => R) => {
  return (a: A) => (b: B) => fn(a, b);
};

/**
 * Deep clone an object (simple implementation for our use case)
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  
  const clonedObj = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
};

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function execution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate percentage discount
 */
export const calculateDiscount = curry((original: number, current: number): number => {
  return Math.round(((original - current) / original) * 100);
});

/**
 * Chunk array into smaller arrays
 * Useful for pagination and batch processing
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  return array.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks[chunkIndex] = [];
    }
    chunks[chunkIndex].push(item);
    return chunks;
  }, [] as T[][]);
};

/**
 * Generate unique ID (simple implementation)
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};
