import React, { Suspense } from 'react';

// 路由加载组件
const LazyLoad = (
  Component:
    | React.LazyExoticComponent<React.FC<object>>
    | React.LazyExoticComponent<React.ComponentType<unknown>>
) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Component />
    </Suspense>
  );
};

export default LazyLoad;
