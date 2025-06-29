import { lazy, Suspense } from 'react';

export const loadable = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return function LoadableComponent(props) {
    return (
      <Suspense fallback={fallback || <DefaultLoadingComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Example usage with explicit path:
// const MyComponent = loadable(() => import('@/components/MyComponent.jsx'));