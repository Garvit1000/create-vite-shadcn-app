/**
 * Performance utility functions for optimizing React applications
 */

// Debounce function to limit the rate at which a function is called
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memoize function to cache expensive computations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

// Chunk array for pagination or infinite scroll
export const chunkArray = (array, size) => {
  return array.reduce((acc, _, i) => {
    if (i % size === 0) acc.push(array.slice(i, i + size));
    return acc;
  }, []);
};

// Check if intersection observer is supported
export const isIntersectionObserverSupported = () => {
  return 'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype;
};

// Create an intersection observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  if (!isIntersectionObserverSupported()) return null;
  
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};