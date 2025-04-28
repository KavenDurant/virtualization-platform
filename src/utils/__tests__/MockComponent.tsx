import React from 'react';

interface MockComponentProps {
  testProp?: string;
}

const MockComponent: React.FC<MockComponentProps> = ({ testProp }) => {
  return (
    <div data-testid="mock-component">
      {testProp ? `接收到的属性: ${testProp}` : '懒加载组件内容'}
    </div>
  );
};

export default MockComponent;
