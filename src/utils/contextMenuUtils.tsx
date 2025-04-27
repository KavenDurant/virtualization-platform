/*
 * @Author: luojiaxin luo.jiaxin@kanrong.xyz
 * @Date: 2025-04-27 14:05:16
 * @LastEditors: luojiaxin luo.jiaxin@kanrong.xyz
 * @LastEditTime: 2025-04-27 14:56:05
 * @FilePath: /virtualization-platform/src/utils/contextMenuUtils.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';

/**
 * 阻止默认右键菜单的通用工具函数
 */

/**
 * 阻止浏览器默认右键菜单事件的自定义Hook
 * @returns 一个包含onContextMenu事件处理函数的对象
 */
export const usePreventContextMenu = () => {
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return { onContextMenu: preventContextMenu };
};

/**
 * 阻止浏览器默认右键菜单事件的HOC (高阶组件)
 * @param Component 要包装的组件
 * @returns 包装后的组件，该组件会阻止默认右键菜单
 */
export const withPreventContextMenu = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const preventContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      return false;
    };

    return <Component {...props} onContextMenu={preventContextMenu} />;
  };
};

/**
 * 根据点击位置和菜单大小计算菜单的最佳显示位置
 * @param event 右键点击事件
 * @param menuWidth 菜单宽度（像素）
 * @param menuHeight 菜单高度（像素）
 * @param padding 与屏幕边缘的安全距离（像素）
 * @returns 菜单的最佳位置 {x, y}
 */
export const calculateMenuPosition = (
  event: React.MouseEvent | MouseEvent,
  menuWidth: number = 160,
  menuHeight: number = 250, // 增加默认高度估计值
  padding: number = 10
) => {
  // 获取点击坐标
  const x = event.clientX;
  const y = event.clientY;

  // 获取视口尺寸
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 计算最佳X坐标（避免超出右侧边界）
  let bestX = x;
  if (x + menuWidth + padding > viewportWidth) {
    bestX = Math.max(padding, viewportWidth - menuWidth - padding);
  }

  // 计算最佳Y坐标（避免超出底部边界）
  let bestY = y;
  if (y + menuHeight + padding > viewportHeight) {
    bestY = Math.max(padding, viewportHeight - menuHeight - padding);
  }

  return { x: bestX, y: bestY };
};
