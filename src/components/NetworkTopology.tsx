// 导入React核心库和Hooks
import React, { useEffect, useRef, useState } from 'react';
// 导入vis-network库，用于创建交互式网络可视化
import { Network } from 'vis-network';
// 导入vis-data库，用于管理网络数据
import { DataSet } from 'vis-data';
// 导入Ant Design组件
import { Spin, Tooltip, Button, Space } from 'antd';
// 导入Ant Design图标组件
import {
  FullscreenOutlined, // 全屏图标
  ZoomInOutlined, // 放大图标
  ZoomOutOutlined, // 缩小图标
  ReloadOutlined, // 重置图标
} from '@ant-design/icons';

// 扩展DOM元素接口，添加浏览器特定的全屏API
interface FullScreenElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void>; // Safari全屏请求方法
  msRequestFullscreen?: () => Promise<void>; // IE全屏请求方法
  mozRequestFullscreen?: () => Promise<void>; // Firefox全屏请求方法
}

// 扩展Document接口，添加浏览器特定的全屏API
interface FullScreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>; // Safari退出全屏方法
  msExitFullscreen?: () => Promise<void>; // IE退出全屏方法
  mozExitFullscreen?: () => Promise<void>; // Firefox退出全屏方法
  webkitFullscreenElement?: Element; // Safari全屏元素属性
  msFullscreenElement?: Element; // IE全屏元素属性
  mozFullscreenElement?: Element; // Firefox全屏元素属性
}

// 定义拓扑图中的节点类型接口
interface Node {
  id: string; // 节点唯一标识符
  label: string; // 节点标签文本
  title?: string; // 节点悬停提示文本
  group?: string; // 节点分组类别
  shape?: string; // 节点形状
  image?: string; // 节点图片URL（当shape为'image'时使用）
  size?: number; // 节点大小
  color?: {
    // 节点颜色配置
    background?: string; // 背景色
    border?: string; // 边框色
    highlight?: {
      // 高亮状态颜色
      background?: string; // 高亮背景色
      border?: string; // 高亮边框色
    };
  };
  font?: {
    // 节点文字样式
    color?: string; // 文字颜色
    size?: number; // 文字大小
    face?: string; // 字体
    background?: string; // 文字背景色
    strokeWidth?: number; // 文字描边宽度
    strokeColor?: string; // 文字描边颜色
    align?: string; // 文字对齐方式
  };
}

// 定义拓扑图中的连线类型接口
interface Edge {
  id: string; // 连线唯一标识符
  from: string; // 起始节点ID
  to: string; // 目标节点ID
  label?: string; // 连线标签文本
  title?: string; // 连线悬停提示文本
  dashes?: boolean; // 是否使用虚线
  width?: number; // 连线宽度
  length?: number; // 连线长度
  arrows?: {
    // 箭头配置
    to?: boolean | { enabled?: boolean; type?: string }; // 目标箭头
    from?: boolean | { enabled?: boolean; type?: string }; // 起始箭头
  };
  color?: {
    // 连线颜色配置
    color?: string; // 正常颜色
    highlight?: string; // 高亮颜色
    hover?: string; // 悬停颜色
  };
}

// 导出网络拓扑数据接口，包含节点和连线集合
export interface NetworkTopologyData {
  nodes: Node[]; // 节点数组
  edges: Edge[]; // 连线数组
}

// 定义网络拓扑组件属性接口
interface NetworkTopologyProps {
  data: NetworkTopologyData; // 拓扑图数据
  height?: number | string; // 容器高度
  loading?: boolean; // 加载状态
  onNodeClick?: (nodeId: string) => void; // 节点点击回调
  onEdgeClick?: (edgeId: string) => void; // 连线点击回调
}

// 定义网络拓扑组件
const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  data, // 拓扑图数据
  height = 600, // 默认高度为600
  loading = false, // 默认非加载状态
  onNodeClick, // 节点点击回调函数
  onEdgeClick, // 连线点击回调函数
}) => {
  // 创建DOM容器引用，用于挂载网络图
  const containerRef = useRef<FullScreenElement>(null);
  // 创建网络实例引用
  const networkRef = useRef<Network | null>(null);
  // 创建全屏状态管理
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 初始化拓扑图的useEffect钩子
  useEffect(() => {
    // 如果容器不存在或数据不存在，则不进行初始化
    if (!containerRef.current || !data) return;

    // 创建节点数据集
    const nodes = new DataSet<Node>(data.nodes);
    // 创建连线数据集
    const edges = new DataSet<Edge>(data.edges);

    // 定义网络图配置项
    const options = {
      // 节点全局配置
      nodes: {
        shape: 'dot', // 默认形状为圆点
        size: 30, // 默认大小
        font: {
          size: 12, // 字体大小
          color: '#333', // 字体颜色
        },
        borderWidth: 2, // 边框宽度
        fixed: {
          x: false, // 不固定X坐标
          y: false, // 不固定Y坐标
        },
      },
      // 连线全局配置
      edges: {
        width: 2, // 线宽
        color: { color: '#4F8FBA', highlight: '#1890ff', hover: '#1890ff' }, // 线条颜色
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 }, // 平滑曲线设置
      },
      // 物理引擎配置
      physics: {
        enabled: true, // 启用物理引擎
        barnesHut: {
          gravitationalConstant: -1000, // 减小引力常数，使节点之间的相互作用力更小
          centralGravity: 0.1, // 减小中心引力，减少节点向中心飘移的趋势
          springLength: 150, // 适当减小弹簧长度
          springConstant: 0.02, // 减小弹簧常数，使弹簧力更柔和
          damping: 0.05, // 增加阻尼，减少振荡
        },
        // 稳定化配置
        stabilization: {
          enabled: true, // 启用稳定化
          iterations: 1000, // 最大迭代次数
          updateInterval: 100, // 更新间隔
          onlyDynamicEdges: false, // 是否只稳定动态边
          fit: true, // 稳定后调整视图以适应所有节点
        },
        solver: 'barnesHut', // 明确指定使用barnesHut求解器
        timestep: 0.5, // 减小时间步长，使模拟更稳定
        adaptiveTimestep: true, // 启用自适应时间步长
        maxVelocity: 30, // 限制最大速度
        minVelocity: 0.1, // 设置最小速度阈值
      },
      // 交互配置
      interaction: {
        hover: true, // 启用悬停效果
        tooltipDelay: 300, // 提示延迟时间
        zoomView: true, // 允许缩放视图
        dragView: true, // 允许拖拽视图
        navigationButtons: true, // 显示导航按钮
        keyboard: true, // 允许键盘导航
        dragNodes: true, // 确保可以拖动节点
        selectable: true, // 允许选择节点
        multiselect: true, // 允许多选
        hideEdgesOnDrag: false, // 拖拽时不隐藏边
        hideNodesOnDrag: false, // 拖拽时不隐藏节点
      },
      // 分组样式配置
      groups: {
        // 路由器节点样式
        router: {
          shape: 'image', // 使用图片形状
          image: '/src/assets/icons/router.svg', // 路由器图标
          size: 40, // 大小
        },
        // 交换机节点样式
        switch: {
          shape: 'image', // 使用图片形状
          image: '/src/assets/icons/switch.svg', // 交换机图标
          size: 35, // 大小
        },
        // 虚拟机节点样式
        vm: {
          shape: 'image', // 使用图片形状
          image: '/src/assets/icons/vm.svg', // 虚拟机图标
          size: 30, // 大小
        },
        // 网络节点样式
        network: {
          shape: 'dot', // 使用圆点形状
          color: {
            background: '#91d5ff', // 背景色
            border: '#1890ff', // 边框色
          },
          size: 25, // 大小
        },
      },
    };

    // 创建网络实例，传入容器引用、数据和配置项
    networkRef.current = new Network(containerRef.current, { nodes, edges }, options);

    // 添加点击事件监听
    networkRef.current.on('click', function (params) {
      // 如果点击到节点且存在节点点击回调，则调用节点点击回调
      if (params.nodes.length > 0 && onNodeClick) {
        onNodeClick(params.nodes[0]);
      }
      // 如果点击到连线且存在连线点击回调，则调用连线点击回调
      else if (params.edges.length > 0 && onEdgeClick) {
        onEdgeClick(params.edges[0]);
      }
    });

    // 组件清理函数，在组件卸载时执行
    return () => {
      // 如果网络实例存在，则销毁它并置空引用
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data, onNodeClick, onEdgeClick]); // 依赖项：数据和回调函数

  // 处理全屏切换的函数
  const toggleFullscreen = () => {
    // 如果容器不存在，则不执行
    if (!containerRef.current) return;

    // 获取容器元素
    const element = containerRef.current;
    // 获取文档对象并转换类型
    const doc = document as FullScreenDocument;

    // 如果当前不是全屏状态
    if (!isFullscreen) {
      // 根据不同浏览器使用对应的全屏请求方法
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
      }
      // 更新全屏状态为true
      setIsFullscreen(true);
    } else {
      // 如果当前是全屏状态，根据不同浏览器使用对应的退出全屏方法
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else if (doc.mozExitFullscreen) {
        doc.mozExitFullscreen();
      }
      // 更新全屏状态为false
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化事件的useEffect钩子
  useEffect(() => {
    // 获取文档对象并转换类型
    const doc = document as FullScreenDocument;

    // 处理全屏状态变化的函数
    const handleFullscreenChange = () => {
      // 根据当前文档的全屏元素是否存在来设置全屏状态
      setIsFullscreen(
        !!(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.msFullscreenElement ||
          doc.mozFullscreenElement
        )
      );
    };

    // 为不同浏览器添加全屏变化事件监听器
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // 清理函数，在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []); // 空依赖数组表示仅在组件挂载和卸载时执行

  // 放大视图的函数
  const zoomIn = () => {
    // 如果网络实例存在
    if (networkRef.current) {
      // 获取当前缩放比例
      const currentScale = networkRef.current.getScale();
      // 设置新的缩放比例（增加0.1）
      networkRef.current.moveTo({
        scale: currentScale + 0.1,
      });
    }
  };

  // 缩小视图的函数
  const zoomOut = () => {
    // 如果网络实例存在
    if (networkRef.current) {
      // 获取当前缩放比例
      const currentScale = networkRef.current.getScale();
      // 设置新的缩放比例（减少0.1，但不小于0.1）
      networkRef.current.moveTo({
        scale: Math.max(0.1, currentScale - 0.1),
      });
    }
  };

  // 重置视图的函数，使所有节点适应视口
  const resetView = () => {
    // 如果网络实例存在
    if (networkRef.current) {
      // 调用fit方法使所有节点适应视口
      networkRef.current.fit({
        animation: true, // 启用动画效果
      });
    }
  };

  // 渲染组件UI
  return (
    // 最外层容器，设置相对定位和尺寸
    <div style={{ position: 'relative', width: '100%', height }}>
      {/* 加载状态显示，仅在loading为true时渲染 */}
      {loading && (
        <div
          style={{
            position: 'absolute', // 绝对定位
            top: 0, // 顶部对齐
            left: 0, // 左侧对齐
            right: 0, // 右侧对齐
            bottom: 0, // 底部对齐
            display: 'flex', // 弹性布局
            justifyContent: 'center', // 水平居中
            alignItems: 'center', // 垂直居中
            backgroundColor: 'rgba(255, 255, 255, 0.7)', // 半透明白色背景
            zIndex: 10, // 层级设置
          }}
        >
          {/* 加载中图标和文字 */}
          <Spin tip="加载中..." />
        </div>
      )}

      {/* 工具按钮容器 */}
      <div
        style={{
          position: 'absolute', // 绝对定位
          top: 10, // 顶部间距
          right: 10, // 右侧间距
          zIndex: 5, // 层级设置
        }}
      >
        {/* 按钮间距组件 */}
        <Space>
          {/* 放大按钮 */}
          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
          </Tooltip>
          {/* 缩小按钮 */}
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
          </Tooltip>
          {/* 重置视图按钮 */}
          <Tooltip title="重置视图">
            <Button icon={<ReloadOutlined />} onClick={resetView} />
          </Tooltip>
          {/* 全屏/退出全屏按钮，根据当前状态显示不同提示 */}
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen} />
          </Tooltip>
        </Space>
      </div>

      {/* 网络拓扑图容器，设置引用和样式 */}
      <div
        ref={containerRef}
        style={{
          width: '100%', // 宽度100%
          height: '100%', // 高度100%
          border: '1px solid #f0f0f0', // 边框样式
          borderRadius: 8, // 圆角设置
          background: '#fdfdfd', // 背景色
        }}
      />
    </div>
  );
};

// 导出网络拓扑组件
export default NetworkTopology;
