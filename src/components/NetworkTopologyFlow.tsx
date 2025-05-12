import { ApiOutlined, CloudOutlined, DesktopOutlined, SwapOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Edge,
  EdgeMouseHandler,
  Handle,
  Node,
  NodeMouseHandler,
  Position,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const { Text } = Typography;

// 节点数据类型定义
interface NetworkNodeData {
  type: 'router' | 'switch' | 'network' | 'vm';
  label: string;
  subtitle: string;
  status: 'active' | 'inactive' | 'error';
}

// 自定义节点组件
const NetworkNode = ({ data }: { data: NetworkNodeData }) => {
  return (
    <Card
      size="small"
      style={{
        width: 200,
        border: data.status === 'error' ? '1px solid #ff4d4f' : '1px solid #d9d9d9',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {data.type === 'router' && <CloudOutlined style={{ fontSize: 20 }} />}
        {data.type === 'switch' && <SwapOutlined style={{ fontSize: 20 }} />}
        {data.type === 'network' && <ApiOutlined style={{ fontSize: 20 }} />}
        {data.type === 'vm' && <DesktopOutlined style={{ fontSize: 20 }} />}
        <div>
          <Text strong>{data.label}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {data.subtitle}
          </Text>
        </div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </Card>
  );
};

// 节点类型映射
const nodeTypes = {
  networkNode: NetworkNode,
};

interface NetworkTopologyFlowProps {
  data: {
    nodes: Node<NetworkNodeData>[];
    edges: Edge[];
  };
  onNodeClick?: (nodeId: string) => void;
  onEdgeClick?: (edgeId: string) => void;
}

const NetworkTopologyFlow: React.FC<NetworkTopologyFlowProps> = ({
  data,
  onNodeClick,
  onEdgeClick,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);

  // 当 data 更新时，更新节点和边的状态
  useEffect(() => {
    setNodes(data.nodes);
    setEdges(data.edges);
  }, [data, setNodes, setEdges]);

  const onNodeClickHandler: NodeMouseHandler = useCallback(
    (_, node) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  const onEdgeClickHandler: EdgeMouseHandler = useCallback(
    (_, edge) => {
      onEdgeClick?.(edge.id);
    },
    [onEdgeClick]
  );

  return (
    <div style={{ width: '100%', height: 600 }}>
      {/* 隐藏版权信息 */}
      <style>
        {`
          .react-flow__attribution {
            display: none !important;
          }
        `}
      </style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClickHandler}
        onEdgeClick={onEdgeClickHandler}
        nodeTypes={nodeTypes}
        fitView
        draggable
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NetworkTopologyFlow;
