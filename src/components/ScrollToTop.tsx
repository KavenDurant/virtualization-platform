import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 滚动恢复组件
 * 当路由变化时，自动将页面滚动到顶部
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 当路径变化时，滚动到页面顶部
    window.scrollTo(0, 0);

    // 如果有特定的内容容器，也可以重置其滚动位置
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
