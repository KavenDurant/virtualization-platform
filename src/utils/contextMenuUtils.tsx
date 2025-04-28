/*
 * @Author: luojiaxin luo.jiaxin@kanrong.xyz
 * @Date: 2025-04-27 14:05:16
 * @LastEditors: luojiaxin luo.jiaxin@kanrong.xyz
 * @LastEditTime: 2025-04-27 14:56:05
 * @FilePath: /virtualization-platform/src/utils/contextMenuUtils.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 导入React核心库，用于编写组件和Hooks
import React from 'react';

/**
 * 阻止默认右键菜单的通用工具函数
 */

/**
 * 阻止浏览器默认右键菜单事件的自定义Hook
 * @returns 一个包含onContextMenu事件处理函数的对象
 */
export const usePreventContextMenu = () => {
  // 定义一个函数，用于阻止默认的右键菜单
  const preventContextMenu = (e: React.MouseEvent) => {
    // 阻止浏览器显示默认右键菜单
    e.preventDefault();
    // 返回false以进一步确保默认行为被阻止
    return false;
  };

  // 返回一个对象，包含onContextMenu处理函数，可以直接用于组件的props
  return { onContextMenu: preventContextMenu };
};

/**
 * 阻止浏览器默认右键菜单事件的HOC (高阶组件)
 * @param Component 要包装的组件
 * @returns 包装后的组件，该组件会阻止默认右键菜单
 */
export const withPreventContextMenu = <P extends object>(Component: React.ComponentType<P>) => {
  // 返回一个新组件，它包装了传入的组件
  return (props: P) => {
    // 定义阻止默认右键菜单的函数
    const preventContextMenu = (e: React.MouseEvent) => {
      // 阻止浏览器显示默认右键菜单
      e.preventDefault();
      // 返回false以进一步确保默认行为被阻止
      return false;
    };

    // 返回原始组件，但添加了onContextMenu属性，使其阻止默认右键菜单
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
  // 事件参数，可以是React的MouseEvent或DOM原生MouseEvent
  event: React.MouseEvent | MouseEvent,
  // 菜单宽度参数，默认为160像素
  menuWidth: number = 160,
  // 菜单高度参数，默认为250像素
  menuHeight: number = 250, // 增加默认高度估计值
  // 与屏幕边缘的安全距离，默认为10像素
  padding: number = 10
) => {
  // 获取鼠标点击的X坐标（相对于视口）
  const x = event.clientX;
  // 获取鼠标点击的Y坐标（相对于视口）
  const y = event.clientY;

  // 获取浏览器视口的宽度
  const viewportWidth = window.innerWidth;
  // 获取浏览器视口的高度
  const viewportHeight = window.innerHeight;

  // 计算最佳X坐标，确保菜单不会超出屏幕右侧
  let bestX = x;
  // 检查菜单是否会超出右侧边界
  if (x + menuWidth + padding > viewportWidth) {
    // 如果会超出，则将菜单放置在不超出的位置，但不小于左侧padding
    bestX = Math.max(padding, viewportWidth - menuWidth - padding);
  }

  // 计算最佳Y坐标，确保菜单不会超出屏幕底部
  let bestY = y;
  // 检查菜单是否会超出底部边界
  if (y + menuHeight + padding > viewportHeight) {
    // 如果会超出，则将菜单放置在不超出的位置，但不小于顶部padding
    bestY = Math.max(padding, viewportHeight - menuHeight - padding);
  }

  // 返回计算出的最佳位置坐标
  return { x: bestX, y: bestY };
};
