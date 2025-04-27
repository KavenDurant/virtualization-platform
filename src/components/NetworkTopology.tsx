import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { Spin, Tooltip, Button, Space } from 'antd';
import {
  FullscreenOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

// 扩展DOM元素接口，添加浏览器特定的全屏API
interface FullScreenElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
  mozRequestFullscreen?: () => Promise<void>;
}

// 扩展Document接口，添加浏览器特定的全屏API
interface FullScreenDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
  mozExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element;
  msFullscreenElement?: Element;
  mozFullscreenElement?: Element;
}

// 定义拓扑图中的节点和连线类型
interface Node {
  id: string;
  label: string;
  title?: string;
  group?: string;
  shape?: string;
  image?: string;
  size?: number;
  color?: {
    background?: string;
    border?: string;
    highlight?: {
      background?: string;
      border?: string;
    };
  };
  font?: {
    color?: string;
    size?: number;
    face?: string;
    background?: string;
    strokeWidth?: number;
    strokeColor?: string;
    align?: string;
  };
}

interface Edge {
  id: string;
  from: string;
  to: string;
  label?: string;
  title?: string;
  dashes?: boolean;
  width?: number;
  length?: number;
  arrows?: {
    to?: boolean | { enabled?: boolean; type?: string };
    from?: boolean | { enabled?: boolean; type?: string };
  };
  color?: {
    color?: string;
    highlight?: string;
    hover?: string;
  };
}

export interface NetworkTopologyData {
  nodes: Node[];
  edges: Edge[];
}

interface NetworkTopologyProps {
  data: NetworkTopologyData;
  height?: number | string;
  loading?: boolean;
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  data,
  height = 600,
  loading = false,
  onNodeClick,
  onEdgeClick,
}) => {
  const containerRef = useRef<FullScreenElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 初始化拓扑图
  useEffect(() => {
    if (!containerRef.current || !data) return;

    const nodes = new DataSet<Node>(data.nodes);
    const edges = new DataSet<Edge>(data.edges);

    const options = {
      nodes: {
        shape: 'dot',
        size: 30,
        font: {
          size: 12,
          color: '#333',
        },
        borderWidth: 2,
      },
      edges: {
        width: 2,
        color: { color: '#4F8FBA', highlight: '#1890ff', hover: '#1890ff' },
        smooth: { enabled: true, type: 'continuous', roundness: 0.5 },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.05,
          damping: 0.09,
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 300,
        zoomView: true,
        dragView: true,
        navigationButtons: true,
        keyboard: true,
      },
      groups: {
        router: {
          shape: 'image',
          image: '/src/assets/icons/router.svg',
          size: 40,
        },
        switch: {
          shape: 'image',
          image: '/src/assets/icons/switch.svg',
          size: 35,
        },
        vm: {
          shape: 'image',
          image: '/src/assets/icons/vm.svg',
          size: 30,
        },
        network: {
          shape: 'dot',
          color: {
            background: '#91d5ff',
            border: '#1890ff',
          },
          size: 25,
        },
      },
    };

    // 创建网络实例
    networkRef.current = new Network(containerRef.current, { nodes, edges }, options);

    // 添加事件监听
    networkRef.current.on('click', function (params) {
      if (params.nodes.length > 0 && onNodeClick) {
        onNodeClick(params.nodes[0]);
      } else if (params.edges.length > 0 && onEdgeClick) {
        onEdgeClick(params.edges[0]);
      }
    });

    // 组件清理函数
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data, onNodeClick, onEdgeClick]);

  // 处理全屏切换
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const doc = document as FullScreenDocument;

    if (!isFullscreen) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else if (doc.mozExitFullscreen) {
        doc.mozExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // 监听全屏变化事件
  useEffect(() => {
    const doc = document as FullScreenDocument;

    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          doc.fullscreenElement ||
          doc.webkitFullscreenElement ||
          doc.msFullscreenElement ||
          doc.mozFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // 放大
  const zoomIn = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({
        scale: currentScale + 0.1,
      });
    }
  };

  // 缩小
  const zoomOut = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({
        scale: Math.max(0.1, currentScale - 0.1),
      });
    }
  };

  // 重置视图
  const resetView = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: true,
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 10,
          }}
        >
          <Spin tip="加载中..." />
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 5,
        }}
      >
        <Space>
          <Tooltip title="放大">
            <Button icon={<ZoomInOutlined />} onClick={zoomIn} />
          </Tooltip>
          <Tooltip title="缩小">
            <Button icon={<ZoomOutOutlined />} onClick={zoomOut} />
          </Tooltip>
          <Tooltip title="重置视图">
            <Button icon={<ReloadOutlined />} onClick={resetView} />
          </Tooltip>
          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen} />
          </Tooltip>
        </Space>
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          border: '1px solid #f0f0f0',
          borderRadius: 8,
          background: '#fdfdfd',
        }}
      />
    </div>
  );
};

export default NetworkTopology;
