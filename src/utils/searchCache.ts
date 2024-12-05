interface CacheOptions {
  maxAge?: number; // Maximum age of cache entries in milliseconds
  maxSize?: number; // Maximum number of entries in cache
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class SearchCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private maxAge: number;
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.maxAge = options.maxAge || 5 * 60 * 1000; // 5 minutes default
    this.maxSize = options.maxSize || 100; // 100 entries default
  }

  private generateKey(query: string, filters?: Record<string, any>): string {
    return JSON.stringify({ query, filters });
  }

  set(query: string, data: T, filters?: Record<string, any>): void {
    const key = this.generateKey(query, filters);
    
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(query: string, filters?: Record<string, any>): T | null {
    const key = this.generateKey(query, filters);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  removeExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}
