import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 面包屑项类型定义
export interface BreadcrumbItem {
  key: string; // 唯一标识
  title: string; // 显示的标题
  path: string; // 路径
  query?: Record<string, string>; // 查询参数
}

// 面包屑状态类型定义
export interface BreadcrumbState {
  items: BreadcrumbItem[];
  // 历史记录堆栈，用于回退功能
  history: BreadcrumbItem[][];
}

// 初始状态
const initialState: BreadcrumbState = {
  items: [],
  history: [],
};

// 创建面包屑切片
export const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    // 设置面包屑项
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      // 将当前面包屑加入历史记录
      if (state.items.length > 0) {
        state.history.push([...state.items]);
        // 限制历史记录最大数量，避免内存占用过多
        if (state.history.length > 20) {
          state.history.shift();
        }
      }
      state.items = action.payload;
    },

    // 添加面包屑项
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      console.log('action.payload', action);

      // 检查是否已存在相同key的项，避免重复
      const existingIndex = state.items.findIndex(item => item.key === action.payload.key);

      // 将当前面包屑加入历史记录
      state.history.push([...state.items]);

      // 如果已存在，更新该项
      if (existingIndex >= 0) {
        state.items = state.items.slice(0, existingIndex + 1);
        state.items[existingIndex] = action.payload;
      } else {
        // 如果不存在，添加新项
        state.items.push(action.payload);
      }
    },

    // 导航到指定面包屑位置（删除后面的项）
    navigateToBreadcrumb: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex(item => item.key === action.payload);
      if (index >= 0) {
        // 将当前面包屑加入历史记录
        state.history.push([...state.items]);
        // 保留到指定位置的项
        state.items = state.items.slice(0, index + 1);
      }
    },

    // 返回上一个面包屑状态
    goBack: state => {
      if (state.history.length > 0) {
        // 从历史记录中取出最后一个状态
        const previousState = state.history.pop();
        if (previousState) {
          state.items = previousState;
        }
      }
    },

    // 清除所有面包屑
    clearBreadcrumbs: state => {
      state.history.push([...state.items]);
      state.items = [];
    },
  },
});

// 导出action creators
export const { setBreadcrumbs, addBreadcrumb, navigateToBreadcrumb, goBack, clearBreadcrumbs } =
  breadcrumbSlice.actions;

// 导出reducer
export default breadcrumbSlice.reducer;
