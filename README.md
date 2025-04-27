# 虚拟化平台前端项目

这是一个基于React、TypeScript和Vite构建的现代化虚拟化管理平台前端项目，旨在提供高效、直观的虚拟机、存储和网络资源管理界面。

## 技术选型说明

### 核心技术栈

- **React 19**: 最新版本的React框架，提供更好的性能和并发渲染能力
- **TypeScript**: 为JavaScript提供静态类型检查，提高代码质量和开发效率
- **Vite**: 下一代前端构建工具，提供极速的开发服务器和优化的构建过程
- **Ant Design**: 企业级UI组件库，提供丰富的预设组件和设计规范
- **React Router**: 强大的前端路由管理，支持各种复杂的路由场景
- **Axios**: 基于Promise的HTTP客户端，用于与后端API通信
- **ECharts**: 强大的数据可视化库，用于展示各类监控和统计图表

### 为什么选择这个技术栈？

1. **React + TypeScript**:

   - React是目前最流行的前端框架之一，具有丰富的生态系统和社区支持
   - TypeScript提供了类型安全，减少了运行时错误，提高了代码可维护性和协作效率
   - React 19版本带来了更好的并发特性和性能优化

2. **Vite**:

   - 相比传统的webpack，开发环境下的热更新速度提升显著
   - 基于ESM的按需编译，开发服务器启动几乎瞬时
   - 优化的构建配置，简化了开发流程

3. **Ant Design**:
   - 提供了丰富的企业级UI组件，满足复杂应用场景需求
   - 设计语言统一，用户体验一致
   - 提供Pro Components等高级组件，加速开发效率

## 项目中使用的库详解

### 1. 核心库

#### React 19 (`react`, `react-dom`)

- **用途**：构建用户界面的JavaScript库
- **优点**：
  - 新的并发渲染引擎，支持优先级渲染
  - 改进的服务器端组件
  - 更好的批量更新，减少不必要的重渲染
  - 自动内存管理，减少内存泄漏风险
- **重要配置**：
  - Strict Mode：帮助检测潜在问题
  - 支持函数式组件和React Hooks

#### TypeScript (`typescript`)

- **用途**：JavaScript的超集，添加静态类型
- **优点**：
  - 在开发阶段就能捕获类型错误
  - 改进代码自动完成和智能提示
  - 使代码更容易理解和维护
  - 更好的重构支持
- **重要配置**：
  - `tsconfig.json`：TypeScript编译器配置
  - 严格模式(`strict: true`)：启用更严格的类型检查
  - `skipLibCheck: true`：跳过声明文件的类型检查，加快构建速度

#### Vite (`vite`)

- **用途**：现代前端构建工具
- **优点**：
  - 基于ESM的开发服务器，启动速度快
  - 按需编译，热更新近乎瞬时
  - 内置TypeScript支持
  - 优化的构建输出
- **重要配置**：
  - `plugins`：插件配置，如`react()`用于React支持
  - `resolve.alias`：路径别名，简化导入路径
  - `css.preprocessorOptions`：CSS预处理器配置
  - `server.proxy`：API代理配置
  - `test`：测试配置，支持Vitest
  - `build`：生产构建配置

### 2. UI组件库

#### Ant Design (`antd`)

- **用途**：企业级UI组件库
- **优点**：
  - 丰富的组件集合，覆盖大部分UI需求
  - 良好的设计语言和视觉风格
  - 强大的主题定制能力
  - 完善的无障碍设计
- **重要配置**：
  - 主题配置：通过Less变量定制主题
  - 国际化配置：支持多语言
  - ConfigProvider：全局配置上下文
  - 动态主题：支持暗黑模式等

#### Ant Design Icons (`@ant-design/icons`)

- **用途**：Ant Design的图标库
- **优点**：
  - 丰富的图标集合
  - 支持自定义图标
  - 按需加载减小包体积
- **配置**：无特殊配置，直接导入使用

#### Ant Design Pro Components (`@ant-design/pro-components`)

- **用途**：基于Ant Design的高级组件
- **优点**：
  - 提供更复杂的业务组件
  - 简化表单、表格、布局等组件的使用
  - 支持高度定制
- **重要组件**：
  - ProTable：增强的表格组件
  - ProForm：高级表单组件
  - ProLayout：专业的布局组件

### 3. 路由与状态管理

#### React Router (`react-router-dom`)

- **用途**：React应用的路由管理
- **优点**：
  - 声明式路由定义
  - 支持嵌套路由
  - 强大的导航控制
  - 路由参数和查询字符串解析
- **重要配置**：
  - `createBrowserRouter`：创建路由配置
  - 路由定义：路径、组件、加载数据等
  - 路由守卫：通过loader和action控制路由访问

### 4. 网络请求

#### Axios (`axios`)

- **用途**：基于Promise的HTTP客户端
- **优点**：
  - 支持浏览器和Node.js
  - 拦截请求和响应
  - 转换请求和响应数据
  - 自动转换JSON数据
  - 客户端支持防御XSRF
- **重要配置**：
  - 创建实例：`axios.create()`配置基础URL等
  - 拦截器：设置请求/响应拦截器处理认证等
  - 错误处理：统一的错误处理机制

### 5. 数据可视化

#### ECharts (`echarts`)

- **用途**：强大的交互式图表库
- **优点**：
  - 丰富的图表类型
  - 强大的定制能力
  - 良好的交互体验
  - 支持大数据渲染
- **重要配置**：
  - 图表配置选项
  - 主题定制
  - 按需导入减小包体积

#### vis-network & vis-data (`vis-network`, `vis-data`)

- **用途**：网络可视化
- **优点**：
  - 专为网络和拓扑图设计
  - 支持交互式拖拽
  - 高度可定制的外观
  - 适合复杂网络关系展示
- **重要配置**：
  - 节点和边的配置
  - 物理引擎参数
  - 交互选项

### 6. 工具库

#### Moment.js (`moment`)

- **用途**：日期处理库
- **优点**：
  - 简化日期操作
  - 支持格式化和解析
  - 丰富的时区支持
  - 国际化支持
- **替代选择**：
  - 考虑使用体积更小的`dayjs`或原生`Intl.DateTimeFormat`

#### Less (`less`, `less-loader`)

- **用途**：CSS预处理器
- **优点**：
  - 变量支持
  - 嵌套规则
  - 混合(Mixins)
  - 函数和运算
  - 模块化管理样式
- **重要配置**：
  - Vite中的配置：`css.preprocessorOptions.less`
  - javascriptEnabled：启用JavaScript表达式
  - modifyVars：修改Less变量

### 7. 开发工具

#### ESLint (`eslint`, `@eslint/js`, `typescript-eslint`)

- **用途**：代码质量检查工具
- **优点**：
  - 识别并报告JavaScript/TypeScript代码中的问题
  - 支持自定义规则
  - TypeScript支持
  - 可修复的规则自动修复代码
- **重要配置**：
  - `eslint.config.js`：ESLint配置文件
  - 规则集：recommended、strict等
  - 插件：react-hooks、react-refresh等

#### Prettier (`prettier`, `eslint-plugin-prettier`, `eslint-config-prettier`)

- **用途**：代码格式化工具
- **优点**：
  - 统一的代码风格
  - 支持多种语言
  - 与ESLint集成
  - 减少代码审查中关于格式的讨论
- **重要配置**：
  - 格式化规则：如缩进、引号样式等
  - 与ESLint集成：eslint-plugin-prettier

#### Husky & lint-staged (`husky`, `lint-staged`)

- **用途**：Git hooks管理和暂存文件处理
- **优点**：
  - 在Git操作前自动运行脚本
  - 只对暂存的文件进行操作
  - 确保代码质量始终如一
- **重要配置**：
  - Husky hooks：pre-commit等
  - lint-staged配置：文件匹配和命令

#### Vitest (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`)

- **用途**：测试框架
- **优点**：
  - 与Vite无缝集成
  - 快速执行测试
  - 类Jest API易于学习
  - 支持React组件测试
- **重要配置**：
  - Vite配置中的test选项
  - globals：是否支持全局测试函数
  - environment：测试环境(jsdom)
  - setupFiles：测试设置文件

## 项目配置文件详解

### vite.config.ts

```typescript
export default defineConfig({
  plugins: [react()], // 启用React支持
  css: {
    preprocessorOptions: {
      less: {
        // Less配置
        javascriptEnabled: true, // 允许在Less文件中使用JavaScript
        additionalData: '@root-entry-name: default;', // 添加全局Less变量
        modifyVars: {
          // 修改Ant Design主题变量
          'primary-color': '#1890ff', // 主题色
          'link-color': '#1890ff', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': '#faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'border-radius-base': '2px', // 组件/浮层圆角
        },
      },
    },
  },
  test: {
    // Vitest测试配置
    globals: true, // 启用全局测试函数(describe, it, expect等)
    environment: 'jsdom', // 使用jsdom模拟浏览器环境
    setupFiles: './src/test/setup.ts', // 测试设置文件
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // 路径别名，使导入更简洁
    },
  },
  server: {
    // 开发服务器配置
    port: 3000, // 服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      // 代理配置
      '/api': {
        // 将/api开头的请求代理到后端服务
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true, // 修改请求头中的Origin为目标URL
        rewrite: path => path.replace(/^\/api/, ''), // 路径重写
      },
    },
  },
  build: {
    // 构建配置
    outDir: 'dist', // 输出目录
    minify: 'terser', // 使用terser压缩代码
    terserOptions: {
      // terser配置
      compress: {
        drop_console: true, // 移除console语句
        drop_debugger: true, // 移除debugger语句
      },
    },
  },
});
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020", // 编译目标JavaScript版本
    "useDefineForClassFields": true, // 使用Object.defineProperty来定义类字段
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // 包含的库定义文件
    "module": "ESNext", // 模块系统
    "skipLibCheck": true, // 跳过声明文件的类型检查，加快编译速度

    /* 启用严格类型检查 */
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 禁止隐式的any类型
    "strictNullChecks": true, // 启用严格的null检查

    /* 模块解析选项 */
    "moduleResolution": "bundler", // 模块解析策略
    "allowImportingTsExtensions": true, // 允许导入.ts扩展名文件
    "resolveJsonModule": true, // 允许导入json模块
    "isolatedModules": true, // 将每个文件作为单独的模块
    "noEmit": true, // 不输出编译结果
    "jsx": "react-jsx", // JSX编译选项

    /* 路径映射 */
    "baseUrl": ".", // 基础路径
    "paths": {
      "@/*": ["src/*"] // 路径别名，与Vite配置一致
    }
  },
  "include": ["src"], // 包含的文件
  "references": [
    { "path": "./tsconfig.node.json" } // 引用其他配置文件
  ]
}
```

### eslint.config.js

```javascript
export default tseslint.config(
  { ignores: ['dist'] }, // 忽略dist目录
  {
    extends: [
      js.configs.recommended, // JS推荐规则
      ...tseslint.configs.recommended, // TS推荐规则
    ],
    files: ['**/*.{ts,tsx}'], // 应用到ts和tsx文件
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新ECMAScript特性
      globals: {
        ...globals.browser, // 浏览器全局变量
        structuredClone: 'readonly', // 添加structuredClone全局变量
      },
    },
    plugins: {
      'react-hooks': reactHooks, // React Hooks插件
      'react-refresh': reactRefresh, // React Refresh插件
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // React Hooks规则
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], // React Refresh规则
      '@typescript-eslint/no-empty-object-type': 'warn', // 降级为警告，不报错
    },
  },
  // Prettier配置
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf', // 行尾使用LF
        },
      ],
    },
  },
  // 确保prettierConfig在最后，用于关闭所有冲突的规则
  prettierConfig
);
```

## 测试框架详解

本项目使用 Vitest + React Testing Library 作为测试方案，这是目前React生态中最现代化的测试组合。

### Vitest

Vitest是为Vite项目设计的测试框架，它与Vite共享配置，提供了极快的测试执行速度。

**关键特性：**

- **Vite集成**：与项目构建工具无缝集成
- **极速执行**：基于esbuild，测试运行速度非常快
- **Jest兼容API**：如果你熟悉Jest，Vitest的API几乎相同
- **支持TypeScript**：原生支持，无需额外配置
- **覆盖率报告**：内置覆盖率工具
- **监视模式**：支持文件更改时自动运行测试
- **并行测试**：多线程执行测试提高效率
- **快照测试**：支持组件快照比对

**配置说明：**

```javascript
// vite.config.ts中的test配置
test: {
  globals: true,  // 启用全局API (describe, it, expect)，无需导入
  environment: 'jsdom',  // 使用jsdom模拟浏览器环境
  setupFiles: './src/test/setup.ts',  // 测试前运行的设置文件
  // coverage: {  // 覆盖率配置（可选）
  //   reporter: ['text', 'html'],  // 覆盖率报告格式
  //   exclude: ['node_modules/', 'src/test/'],  // 排除文件
  // },
  // threads: true,  // 启用多线程
  // isolate: true,  // 隔离环境运行测试
}
```

### React Testing Library

React Testing Library是一个轻量级的测试工具，专注于从用户视角测试React组件。

**关键特性：**

- **用户中心测试**：测试用户交互而不是实现细节
- **简单API**：API简洁易用
- **无障碍性**：鼓励编写无障碍的组件
- **查询优先级**：建议使用角色、标签文本等查询，而非测试ID
- **真实DOM交互**：使用真实DOM事件模拟用户交互

**主要API：**

- `render`：渲染React组件
- `screen`：查询渲染的组件
- `fireEvent`：触发DOM事件
- `waitFor`：等待异步操作完成
- `within`：在子元素中查询
- 各种查询方法：`getBy*`、`findBy*`、`queryBy*`

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn
# 或
pnpm install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 代码规范检查

```bash
npm run lint
# 或
yarn lint
# 或
pnpm lint
```

### 格式化代码

```bash
npm run format
# 或
yarn format
# 或
pnpm format
```

## ESLint配置扩展

如果你正在开发生产应用，我们建议更新配置以启用类型感知的lint规则：

```js
export default tseslint.config({
  extends: [
    // 移除 ...tseslint.configs.recommended 并替换为以下配置
    ...tseslint.configs.recommendedTypeChecked,
    // 或者使用更严格的规则
    ...tseslint.configs.strictTypeChecked,
    // 可选，添加样式规则
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // 其他选项...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

你还可以安装 [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) 和 [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) 来获取React特定的lint规则：

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    // 添加react-x和react-dom插件
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // 其他规则...
    // 启用其推荐的typescript规则
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## 项目结构

```
src/
  ├── assets/        # 静态资源(图标、图片等)
  ├── components/    # 共享组件
  ├── layouts/       # 页面布局组件
  ├── models/        # 数据模型定义
  ├── pages/         # 页面组件
  ├── routers/       # 路由配置
  ├── services/      # API服务
  ├── styles/        # 全局样式
  └── utils/         # 工具函数
```

## 贡献指南

1. Fork本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个Pull Request

## 许可证

[MIT](LICENSE)
